class Repo {
    constructor(site) {
        this.site = site;
    }
}

const repoInstances = {};

fetch('https://api.github.com/users/HiToMiZu/repos')
.then(res => res.json())
.then(data => {
    const form = document.getElementById('repoForm');

    data.forEach(repoData => {
        const name = repoData.name;

        // Create and store Repo instance
        repoInstances[name] = new Repo(repoData.html_url);

        // Create radio input
        const label = document.createElement('label');
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'repo';
        radio.value = name;
        label.innerText = name;

        // ✅ Dynamic change listener
        radio.addEventListener('change', () => {
            const instance = repoInstances[name];
            console.log(`You selected: ${name}`);
            console.log(`Repo URL: ${instance.site}`);
        });

        label.appendChild(radio);
        form.appendChild(label);
    });
});
