class Repo {
  constructor(data) {
    this.name = data.name
    this.site = data.html_url;
    this.readme = `https://raw.githubusercontent.com/${data.owner.login}/${data.name}/${data.default_branch}/README.md`;
    this.download = `https://github.com/${data.owner.login}/${data.name}/archive/refs/heads/${data.default_branch}.zip`;
  }

  open(value) {
    window.open(this[value], '_blank');
  }
}

class RepoManager {
  constructor() {
    this.repoInstances = {};
    this.selectedRepoInstance = null;
    this.form = document.getElementById('repoForm');
    this.setupButtonListeners();
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
    this.createRepoElements(data);
  }

  createRepoElements(data) {
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

  createLabel(id, repoData) {
    const label = document.createElement('label');
    label.setAttribute('for', id);
    label.classList.add('minecraft-slot');
    label.textContent = repoData.name;
    
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
        if(value == 'hide') {
          const div = document.querySelector(`#${this.selectedRepoInstance.name}`).remove();
        } else if(value == 'show') {
          this.form.innerHTML = '';
          this.loadRepos();
        }
      })
    })
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new RepoManager();
});