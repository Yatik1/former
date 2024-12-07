import { GetFormContentByUrl } from '@/actions/form'
import { FormElementInstance } from '@/components/FormElement'
import FormSubmitComponent from '@/components/FormSubmitComponent'

async function SubmitPage({params} : any) {

  const {formUrl} = params as {formUrl:string}

  const form = await GetFormContentByUrl(formUrl)
  if(!form) {
    throw new Error("Form not found")
  }

  const formContent = JSON.parse(form.content) as FormElementInstance[]

  return (
    <FormSubmitComponent formUrl={formUrl} content={formContent} />
  )
}

export default SubmitPage