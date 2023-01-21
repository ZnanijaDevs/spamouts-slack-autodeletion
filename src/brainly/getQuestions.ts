import gql from "./graphql";

type Question = {
  id: number;
  hasAnswers: boolean;
  hasVerifiedAnswers: boolean;
  hasReports: boolean;
  isDeleted: boolean;
}

type ModerationItemInGQLQuestion = {
  reports: { 
    reporter?: { id: string; } 
  }[];
}

type GQLQuestion = {
  moderationItem?: ModerationItemInGQLQuestion;
  answers: {
    hasVerified: boolean;
    nodes: {
      moderationItem?: ModerationItemInGQLQuestion;
    }[]
  }
}

const DELETED_QUESTION_DATA: Omit<Question, "id"> = {
  isDeleted: true,
  hasAnswers: false,
  hasReports: false,
  hasVerifiedAnswers: false
}

const buildGetQuestionsQuery = (ids: number[]): string => {
  let query = `
  fragment ModerationItemWithUserReport on ModerationItem {
    reports {
      ... on UserReport {
        reporter {id}
      }
    }
  }

  query GetQuestions {
  `;

  ids.forEach(id => {
    let encodedId = Buffer.from(`question:${id}`).toString("base64");

    query += `question_${id}: question(id: "${encodedId}") {
      moderationItem {...ModerationItemWithUserReport}
      answers {
        hasVerified
        nodes { moderationItem {...ModerationItemWithUserReport} }
      }
    }`
  });

  query += " }";
  return query;
}

export async function getQuestions(ids: number[]) {
  const questionsData = await gql<Record<string, GQLQuestion>>(buildGetQuestionsQuery(ids));

  const questions: Question[] = Object.entries(questionsData).map(([key, question]) => {
    let questionId = +key.replace("question_", "");

    if (!question) return { id: questionId, ...DELETED_QUESTION_DATA };

    const isUserReport = (report: object) => "reporter" in report;

    let hasReports = question.moderationItem?.reports?.some(isUserReport) ||
      question.answers.nodes.some(answer => answer.moderationItem?.reports?.some(isUserReport));

    return {
      id: questionId,
      isDeleted: false,
      hasAnswers: question.answers.nodes.length > 0,
      hasVerifiedAnswers: question.answers.hasVerified,
      hasReports
    }
  });

  return questions;
}