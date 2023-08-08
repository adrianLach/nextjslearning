import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { ChangeEvent, ChangeEventHandler, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes, useEffect, useState } from 'react'
import showdown from 'showdown'

const Button = {
    Submit: (props: InputHTMLAttributes<HTMLInputElement>) => <input {...props} type="submit" className={'font-sans bg-green-200 active:bg-green-400 active:border-green-700 hover:bg-green-300 rounded hover:rounded-lg border-2 border-green-500 px-8 py-1 ease-in duration-100' + ' ' + props.className}></input>,
    Confirm: (props: InputHTMLAttributes<HTMLInputElement>) => <input {...props} type="button" className={'font-sans bg-sky-200 active:bg-sky-400 active:border-sky-700 hover:bg-sky-300 rounded hover:rounded-lg border-2 border-sky-500 px-8 py-1 ease-in duration-100' + ' ' + props.className}></input>,
    Cancel: (props: InputHTMLAttributes<HTMLInputElement>) => <input {...props} type="button" className={'font-sans bg-red-200 active:bg-red-400 active:border-red-700 hover:bg-red-300 rounded hover:rounded-lg border-2 border-red-500 px-8 py-1 ease-in duration-100' + ' ' + props.className}></input>
}

const Input = {
    Text: (props: InputHTMLAttributes<HTMLInputElement> & { qualified?: boolean }) => <input type="text" {...props} className={'rounded border-2 px-2 py-1 border-sky-500 ' + props.className}></input>,
    Textarea: (props: TextareaHTMLAttributes<HTMLTextAreaElement> & { qualified?: boolean }) => <textarea {...props} className={'h-full rounded border-2 px-2 py-1 border-sky-500 ' + props.className}></textarea>,
    Number: (props: InputHTMLAttributes<HTMLInputElement> & { qualified?: boolean }) => <input type="number" pattern="\d*" {...props} className={'rounded border-2 px-2 py-1 border-sky-500 ' + props.className}></input>,
}

const Stack = {
    Vertical: (props: { children: ReactNode, className?: string }) => <div className={'flex flex-col space-y-2 ' + (props.className || '')}>{props.children}</div>,
    Horizontal: (props: { children: ReactNode, className?: string }) => <div className={'flex flex-row space-x-2 ' + (props.className || '')}>{props.children}</div>
}

const Label = {
    Header: (props: {children: ReactNode}) => <p className='font-sans text-2xl'>{props.children}</p>,
    Label: (props: {children: ReactNode}) => <p className='font-sans text-base'>{props.children}</p>,
}

const Container = {
    Box: (props: { children: ReactNode, className?: string }) => <div className="flex flex-row space-x-2 mx-2 my-2">{props.children}</div>
}

const useInputValue = (options?: { initial?: string | number, qualifier?: RegExp, onChange?: (event: ChangeEvent<HTMLInputElement>) => string | number | readonly string[] }) => {

    const [value, setValue] = useState<string | number | readonly string[]>(options?.initial || '')
    const [qualified, setQualified] = useState(false)

    const onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event: ChangeEvent<HTMLInputElement>) => {

        if (options?.onChange)
            return setValue(options.onChange(event))

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

const Persona = (props: {url: string, name: string}) => 
    (
        <div className='flex space-x-2 p-2 rounded-lg shadow ease-in-out duration-500 hover:shadow-indigo-500/50 hover:shadow-md'>
            <Image className='rounded-full' src={props.url} alt='' width={32} height={32}></Image>
            <h2 className='font-sans inline-block align-middle'>{props.name}</h2>
        </div>
    )

const SessionButton = () => {
    const { data: session } = useSession()

    if (session)
        return (
            <>
                <p>Logged in as {session.user && session.user['id']}</p>
                <Button.Cancel onClick={() => signOut()} value={'Log Out'}></Button.Cancel>
            </>
        )

    return (
        <>
            <p>Log In using Gtihub</p>
            <Button.Confirm onClick={() => signIn()} value={'Log In'}></Button.Confirm>
        </>
    )

}
const Index = () => {

    const formatFAInput = useInputValue()
    const formatPDInput = useInputValue()

    useEffect(() => {
        
        const formatFA = formatFAInput.value.toString()
        const formatPD = formatPDInput.value.toString()

        let _formula = ''
        let index = 0, length = 0

        formatPD.split('/').forEach(e => {

            
            index = formatFA.indexOf(e, index + length)
            length = e.length

            if(e.length == 0 || index < 0)
                return

            _formula = _formula + `[SUBSTR([SELF]:${index + 1}:${length})]${'/'}`

        })

        setFormula(_formula.replace(/^\/+|\/+$/g, ''))

    }, [formatFAInput, formatPDInput])

    const [formula, setFormula] = useState('')

    return (
        <>
            <div className='basis-1/4 rounded-lg h-full flex justify-between p-2'>
                <div>

                </div>
            </div>
            <div className="flex w-full space-x-2 p-4 content-center ">
                <div className="grow p-2">
                    <Stack.Vertical>
                        <div className='flex'>
                            <p className='w-48 font-sans text-base content-center leading-10'>Format FA</p>
                            <Input.Text {...formatFAInput} className='grow'></Input.Text>
                        </div>
                        <div className='flex'>
                            <p className='w-48 font-sans text-base content-center leading-10'>Format proDoppik</p>
                            <Input.Text {...formatPDInput} className='grow'></Input.Text>
                        </div>
                        <Input.Textarea readOnly value={formula} style={{minHeight: '400px'}}></Input.Textarea>
                    </Stack.Vertical>
                </div>
            </div>
        </>
    )
}

export default Index