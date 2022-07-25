const ul = document.querySelector('ul')
const form = document.querySelector('.form')
const title = document.querySelector('.title ')
const body = document.querySelector('.body')

let headers = new Headers();

headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');

headers.append('Access-Control-Allow-Origin', 'http://localhost:7000');
headers.append('Access-Control-Allow-Credentials', 'true');

headers.append('GET', 'POST', 'OPTIONS');
headers.append('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmRlOGZkZjM4MGRkOGFiMjUzYzk0NjYiLCJ1c2VybmFtZSI6InJhaHVsIiwiaWF0IjoxNjU4NzUyOTkxfQ.J7ggRZ64fXJA_E0ZtFArkPhtY_awGj1TQ6105j6B9RI')

console.log(form, title, body)

async function getPost() {
    try {
        const data = await fetch('http://localhost:7000/', {
            method: "GET"
        })
        const realdata = await data.json()
        console.log(realdata)
        for (let object in realdata) {
            const { title, owner } = realdata[object]
            const li = document.createElement('li')
            li.textContent = `${title} ---> ${owner.username}`
            ul.append(li)
        }

    } catch (error) {
        console.log({ error })
    }
}

getPost()


form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const object = {}
    object.title = title.value,
        object.body = body.value
    const data = await fetch('http://localhost:7000/create', {
        method: 'POST',
        body: JSON.stringify(object),
        headers:headers
    })
    const realData = await data.json()
    console.log(realData)
})