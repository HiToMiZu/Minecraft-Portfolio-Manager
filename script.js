class Repo {
  constructor(data) {
    this.name = data.name
    this.site = data.html_url;
    this.readme = `https://raw.githubusercontent.com/${data.owner.login}/${data.name}/${data.default_branch}/README.md`;
    this.download = `https://github.com/${data.owner.login}/${data.name}/archive/refs/heads/${data.default_branch}.zip`;
    this.description = data.description || 'No description available';
    this.language = data.language || 'Unknown';
    this.createdAt = new Date(data.created_at).toLocaleDateString();
    this.updatedAt = new Date(data.updated_at).toLocaleDateString();
    this.avatar = data.avatar_url;
  }

  open(value) {
    window.open(this[value], '_blank');
  }
}

class RepoManager {
  constructor() {
    this.repoInstances = {};
    this.allReposData = [];
    this.selectedRepoInstance = null;
    this.form = document.getElementById('repoForm');
    this.searchInput = document.getElementById('search');
    this.setupButtonListeners();
    this.setupSearchListener();
    this.init();
  }

  async init() {
    try {
      await this.loadRepos();
    } catch (error) {
      console.error('Failed to load repositories:', error);
    }
  }

  async loadRepos() {
    const response = await fetch('https://api.github.com/users/dyad-sh/repos');
    const data = await response.json();
    this.allReposData = data;
    this.createRepoElements(data);
  }

  createRepoElements(data) {
    this.form.innerHTML = '';
    this.repoInstances = {};

    data.forEach((repoData, index) => {
      const id = `repo-${index}`;
      this.repoInstances[repoData.name] = new Repo(repoData);

      const div = this.creatediv(repoData.name);
      const radio = this.createRadio(id, repoData.name);
      const label = this.createLabel(id, repoData);

      div.appendChild(radio);
      div.appendChild(label);

      this.form.appendChild(div);
    });
  }

  setupSearchListener() {
    const debounce = (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    };

    const debouncedSearch = debounce(this.performSearch.bind(this), 300);

    this.searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      debouncedSearch(query);
    });

    this.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.searchInput.value = '';
        this.performSearch('');
      }
    });
  }

  performSearch(query) {
    if (!query) {
      this.createRepoElements(this.allReposData);
      return;
    }

    const searchTerm = query.toLowerCase();

    const filteredRepos = this.allReposData.filter(repo => {
      const name = repo.name.toLowerCase();
      const description = (repo.description || '').toLowerCase();
      const language = (repo.language || '').toLowerCase();

      return name.includes(searchTerm) ||
        description.includes(searchTerm) ||
        language.includes(searchTerm);
    });

    this.createRepoElements(filteredRepos);

    if (filteredRepos.length === 0) {
      this.showNoResults(query);
    }
  }

  showNoResults(query) {
    this.form.innerHTML = `
      <div class="no-results">
        No repositories found for "${query}"
      </div>
    `;
  }

  creatediv(reponame) {
    const div = document.createElement('div');
    div.id = reponame;
    div.classList.add('minecraft-saves');
    return div;
  }

  createRadio(id, repoName) {
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'repo';
    radio.value = repoName;
    radio.id = id;
    radio.classList.add('radio-hidden');

    radio.addEventListener('change', () => {
      this.selectedRepoInstance = this.repoInstances[repoName];
    });

    return radio;
  }

  // Replace your createLabel method with this updated version:

  createLabel(id, repoData) {
    const label = document.createElement('label');
    label.setAttribute('for', id);
    label.classList.add('minecraft-slot');

    const repo = this.repoInstances[repoData.name];

    label.innerHTML = `
      <div class="repo-img-container">
      <img class="repo-img" src="${repoData.owner.avatar_url}" alt="Repository icon">
      </div>
      <div class="repo-text-content">
        <div class="repo-main-info">
          <strong class="repo-name">${repo.name}</strong>
        </div>
        <div class="repo-description">${repo.description}</div>
        <div class="repo-details">
          <span class="repo-language">${repo.language}</span>
          <span class="repo-created">Created: ${repo.createdAt}</span>
          <span class="repo-updated">Last updated: ${repo.updatedAt}</span>
        </div>
      </div>
  `;

    label.addEventListener('dblclick', () => {
      this.selectedRepoInstance?.open('site');
    });

    return label;
  }

  setupButtonListeners() {
    document.querySelectorAll('.bttn').forEach(button => {
      button.addEventListener('click', (event) => {
        const value = event.target.value;
        this.selectedRepoInstance?.open(value);
      });
    });

    document.querySelectorAll('.displaybttn').forEach(button => {
      button.addEventListener('click', (event) => {
        const value = event.target.value;
        if (value == 'hide') {
          if (this.selectedRepoInstance) {
            const div = document.querySelector(`#${this.selectedRepoInstance.name}`);
            if (div) {
              div.remove();
              this.allReposData = this.allReposData.filter(repo =>
                repo.name !== this.selectedRepoInstance.name
              );
              this.selectedRepoInstance = null;
            }
          }
        } else if (value == 'show') {
          this.searchInput.value = '';
          this.form.innerHTML = '';
          this.loadRepos();
        }
      })
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new RepoManager();
});