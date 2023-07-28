import { ChangeEvent, ChangeEventHandler, InputHTMLAttributes, ReactElement, ReactNode, ReactPortal, TextareaHTMLAttributes, useEffect, useState } from "react"

const Button = {
  Submit: (props: InputHTMLAttributes<HTMLInputElement>) => <input {...props} type="submit" className={"font-sans bg-green-200 active:bg-green-400 active:border-green-700 hover:bg-green-300 rounded hover:rounded-lg border-2 border-green-500 px-8 py-1 ease-in duration-100" + ' ' + props.className}></input>,
  Confirm: (props: InputHTMLAttributes<HTMLInputElement>) => <input {...props} type="button" className={"font-sans bg-sky-200 active:bg-sky-400 active:border-sky-700 hover:bg-sky-300 rounded hover:rounded-lg border-2 border-sky-500 px-8 py-1 ease-in duration-100" + ' ' + props.className}></input>,
  Cancel: (props: InputHTMLAttributes<HTMLInputElement>) => <input {...props} type="button" className={"font-sans bg-red-200 active:bg-red-400 active:border-red-700 hover:bg-red-300 rounded hover:rounded-lg border-2 border-red-500 px-8 py-1 ease-in duration-100" + ' ' + props.className}></input>
}

const Input = {
  Text: (props: InputHTMLAttributes<HTMLInputElement> & { qualified?: boolean }) => <input type="text" {...props} className={'rounded border-2 px-2 py-1 border-sky-500 ' + props.className}></input>,
  Textarea: (props: TextareaHTMLAttributes<HTMLTextAreaElement> & { qualified?: boolean }) => <textarea {...props} className={'h-full rounded border-2 px-2 py-1 border-sky-500 ' + props.className}></textarea>,
  Number: (props: InputHTMLAttributes<HTMLInputElement> & { qualified?: boolean }) => <input type="number" pattern="\d*" {...props} className={'rounded border-2 px-2 py-1 border-sky-500 ' + props.className}></input>,
}

const Stack = {
  Vertical: (props: { children: ReactNode, className?: string }) => <div className={"flex flex-col space-y-2 " + (props.className || '')}>{props.children}</div>,
  Horizontal: (props: { children: ReactNode, className?: string }) => <div className={"flex flex-row space-x-2 " + (props.className || '')}>{props.children}</div>
}

const Container = {
  Box: (props: { children: ReactNode, className?: string }) => <div className="mx-2 my-2">{props.children}</div>
}

const useInputValue = (options?: { initial?: string | number, qualifier?: RegExp }) => {

  const [value, setValue] = useState<string | number | readonly string[]>(options?.initial || '')
  const [qualified, setQualified] = useState(false)

  const onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value)
  }

  useEffect(() => {
    if (!options?.qualifier)
      return

    const regArg = (value + '').match(options?.qualifier)

    setQualified(regArg !== null)
  }, [value])

  return { value, qualified, onChange }
}

const Index = () => {

  const textInput = useInputValue({ initial: 'Hello World' })
  const numberInput = useInputValue({ initial: 187 })

  return (
    <>
      <Container.Box>
        <Stack.Horizontal className="min-w-full">
          <Stack.Vertical>
            <Input.Text {...textInput}></Input.Text>
            <Input.Number {...numberInput}></Input.Number>
          </Stack.Vertical>
          <Stack.Vertical>
            <Input.Textarea style={{ minHeight: '60px' }}></Input.Textarea>
          </Stack.Vertical>
        </Stack.Horizontal>
      </Container.Box>
      <Container.Box>
        <Stack.Horizontal>
          <Button.Submit value={'Save'}></Button.Submit>
          <Button.Confirm value={'Save Draft'}></Button.Confirm>
          <Button.Cancel value={'Discard'}></Button.Cancel>
        </Stack.Horizontal>
      </Container.Box>
    </>
  )
}

export default Index