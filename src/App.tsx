import { useState } from 'react'
import './App.css'

interface FormData {
  name: string
  email: string
  message: string
}

interface FormErrors {
  email?: string
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Очищаем ошибку при изменении поля
    if (name === 'email' && errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitStatus(null)
    
    // Валидация
    const newErrors: FormErrors = {}
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email є обов\'язковим полем'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Будь ласка, введіть коректний email'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    
    try {
      // Формуємо тіло листа з даними форми
      const emailBody = `Ім'я: ${formData.name || 'Не вказано'}
Email: ${formData.email}
Повідомлення: ${formData.message || 'Не вказано'}`

      // Відправка
      const response = await fetch('https://formsubmit.co/ajax/troanart@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name || 'Не вказано',
          email: formData.email,
          message: emailBody,
          _subject: '6weeks - Форма заповнена',
          _captcha: false
        })
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '' })
        setErrors({})
      } else {
        throw new Error('Помилка відправки')
      }
    } catch (error) {
      console.error('Помилка відправки:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app">
      <div className="form-container">
        <h1 className="form-title">Контактна форма</h1>
        <p className="form-subtitle">Заповніть форму нижче, щоб зв'язатися з нами</p>
        
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Ім'я
              <span className="optional"> (необов'язково)</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Введіть ваше ім'я"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
              <span className="required"> *</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="example@email.com"
              required
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">
              Повідомлення
              <span className="optional"> (необов'язково)</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Введіть ваше повідомлення"
              rows={5}
            />
          </div>

          {submitStatus === 'success' && (
            <div className="alert alert-success">
              ✓ Форма успішно відправлена! Дякуємо за звернення.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="alert alert-error">
              ✗ Помилка відправки форми. Будь ласка, спробуйте ще раз.
            </div>
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Відправка...' : 'Відправити'}
          </button>
        </form>

       
      </div>
    </div>
  )
}

export default App
