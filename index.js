import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';


const projects = await fetchJSON('./lib/projects.json');

const projectsContainer = document.querySelector('.projects');

if (projectsContainer && projects) {
    const latestProjects = projects.slice(0, 3);
    renderProjects(latestProjects, projectsContainer, 'h3');
}

const githubData = await fetchGitHubData('nithyanair1234');

const profileStats = document.querySelector('#profile-stats');

if (profileStats) {
    profileStats.innerHTML = `
          <dl>
            <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
            <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
            <dt>Followers:</dt><dd>${githubData.followers}</dd>
            <dt>Following:</dt><dd>${githubData.following}</dd>
          </dl>
      `;
  }