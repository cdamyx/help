import { assert } from "$std/_util/asserts.ts";
import { getHelpWantedIssues } from "../lib/github.ts";

const DEVICT_REPOS: string[] = [
  "devict/job-board",
  "devict/devict.org",
  "devict/keeper",
  "devict/hacktoberfest",
  "devict/help",
];

// const COMMUNITY_REPOS: string[] = [];
// const REPOS = [...DEVICT_REPOS, ...COMMUNITY_REPOS];

export default async function Home() {
  const ghToken = Deno.env.get("GITHUB_TOKEN");
  assert(ghToken);

  const issues = await getHelpWantedIssues({
    token: ghToken,
    repos: DEVICT_REPOS,
  });

  return (
    <>
      <h1 class="text-4xl font-bold mb-4">Contribute to devICT</h1>
      <ul class="list-none">
        {issues.map((issue, index) => {
          const [orgName, repoName] = issue.repository_url.split("/").slice(-2);
          const repoPath = `${orgName}/${repoName}`;
          const repoUrl = `https://github.com/${repoPath}`;
          return index === 0 || index > 0 && issue.repository_url != issues[index - 1].repository_url ? (
            <li class="my-1">
              <span class="font-bold underline hover:text-gray-600">
                <a href={repoUrl}>{repoPath}</a>:{" "}
              </span>
              <ul>{issues.map((issue) => {
                  if((issue.html_url).includes(repoPath)){
                    return (<li><span>
                      <a href={issue.html_url} class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600">{issue.title}</a>
                    </span></li>)
                  }
                  })}</ul>
            </li>
          ) : ''
        })}
      </ul>
    </>
  );
}
