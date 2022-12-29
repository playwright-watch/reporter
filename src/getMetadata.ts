const { GITHUB_ACTIONS, GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID } =
  process.env;

function getGithubMetadata() {
  const isGithubActions = Boolean(GITHUB_ACTIONS);

  if (!isGithubActions)
    return {
      github: undefined,
    };

  const runUrl = `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`;

  return {
    github: {
      runUrl,
    },
  };
}

export function getMetadata() {
  return {
    ...getGithubMetadata(),
  };
}
