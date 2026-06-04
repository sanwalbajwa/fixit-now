'use client'

export default function AutoSubmitForm({ children, ...props }) {
  function submitForm(form) {
    if (typeof form?.requestSubmit === 'function') {
      form.requestSubmit()
    }
  }

  function handleChange(event) {
    if (event.target instanceof HTMLSelectElement) {
      submitForm(event.currentTarget)
    }
  }

  function handleBlur(event) {
    if (event.target instanceof HTMLInputElement && event.target.type === 'number') {
      submitForm(event.currentTarget)
    }
  }

  return (
    <form {...props} onChange={handleChange} onBlur={handleBlur}>
      {children}
    </form>
  )
}
