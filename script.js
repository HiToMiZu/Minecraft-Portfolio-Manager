fetch('https://api.github.com/users/HiToMiZu/repos')
.then(res =>  res.json())
.then(data => {
    data.forEach(repo => {
        console.log(repo)
        const list = document.querySelector('ul')
        const nameofrepo = document.createElement('li');
        nameofrepo.innerText = repo.name;
        list.append(nameofrepo);

    });
})