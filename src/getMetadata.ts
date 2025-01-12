const {
  GITHUB_ACTIONS,
  GITHUB_SERVER_URL,
  GITHUB_REPOSITORY,
  GITHUB_RUN_ID,
  GITHUB_REF_NAME = '',
  GITHUB_HEAD_REF,
} = process.env;

function getGithubMetadata() {
  const isGithubActions = Boolean(GITHUB_ACTIONS);

  if (!isGithubActions)
    return {
      github: undefined,
    };

  const runUrl = `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`;

  const pullRequest = GITHUB_REF_NAME.endsWith('/merge')
    ? GITHUB_REF_NAME.split('/')[0]
    : undefined;

  return {
    github: {
      runUrl,
      repository: GITHUB_REPOSITORY,
      branch: GITHUB_HEAD_REF,
      pullRequest,
    },
  };
}

export function getMetadata() {
  return {
    ...getGithubMetadata(),
  };
}
