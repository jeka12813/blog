import { nanoid } from 'nanoid'
import { Modal } from 'bootstrap'

class Form {
  constructor (formElement) {
    this.formElement = formElement
    this.baseUrl = '/api/posts'
    this.instanceModal = Modal.getOrCreateInstance(document.querySelector('#formModal'))
    this.init()
  }

  init () {
    this.formElement.addEventListener('submit', this.handleFormSubmit.bind(this))
  }

  handleFormSubmit (event) {
    event.preventDefault()

    const post = {
      id: nanoid(),
      createdAt: new Date()
    }

    const formData = new FormData(this.formElement)

    for (const [name, value] of formData) {
      post[name] = value
    }

    this.sendData(post)
    this.instanceModal.hide()
    this.formElement.reset()
  }

  sendData (post) {
    const json = JSON.stringify(post)
    fetch(this.baseUrl, {
      method: 'POST',
      body: json,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        const event = new CustomEvent('form.sent', {
          detail: { data }
        })
        window.dispatchEvent(event)
      })
  }
}

export { Form }
