import { useEffect, useState } from 'react'


const Index = () => {

    const [formatFAInput, setFormatFAInput] = useState('')
    const [formatPDInput, setFormatPDInput] = useState('')
    const [formula, setFormula] = useState('')

    useEffect(() => {
        
        const formatFA = formatFAInput
        const formatPD = formatPDInput

        let _formula = ''
        let index = 0, length = 0

        let err = false

        formatPD.split('/').forEach(e => {
            
            index = formatFA.indexOf(e, index + length)
            length = e.length

            if(e.length == 0)
                return

            if(index < 0) {
                _formula = `[Fehler] ${e} wurde nicht in Format FA gefunden. Eingabe prüfen!`
                err = true
            }

            if(err)
                return

            _formula = _formula + `[SUBSTR([SELF]:${index + 1}:${length})]${'/'}`

        })

        setFormula(_formula.replace(/^\/+|\/+$/g, ''))

    }, [formatFAInput, formatPDInput])

    return (
        <>
            <div className="flex w-full space-x-2 p-4 content-center ">
                <div className="grow p-2">
                    <div className={'flex flex-col space-y-2'}>
                        <div className='flex'>
                            <p className='w-48 font-sans text-base content-center leading-10'>Format FA</p>
                            <input type="text" className={'rounded border-2 px-2 py-1 border-sky-500 grow'} value={formatFAInput} onChange={(e) => setFormatFAInput(e.currentTarget.value)}></input>
                        </div>
                        <div className='flex'>
                            <p className='w-48 font-sans text-base content-center leading-10'>Format proDoppik</p>
                            <input type="text" className={'rounded border-2 px-2 py-1 border-sky-500 grow'} value={formatPDInput} onChange={(e) => setFormatPDInput(e.currentTarget.value)}></input>
                        </div>
                        <textarea className={'h-full rounded border-2 px-2 py-1 border-sky-500 '} readOnly value={formula} style={{minHeight: '400px'}}></textarea>,
                    </div>
                </div>
            </div>
        </>
    )
}

export default Index