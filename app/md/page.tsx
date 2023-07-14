'use client'

import { useState } from "react"

const viewWidth = '550px'

const MDView = (props: {md: string}) => {
    return <div style={{width: viewWidth}} dangerouslySetInnerHTML={{__html: props.md}}></div>
}

const DebugView = (props: {md: string}) => {
    return <div style={{width: viewWidth}}>
        {props.md.split('\n').map((e, i) => <div key={i}>{e}</div>)}
    </div>
}

const convertToMarkDown = (text: string) => {

    const lines = text.split('\n')
    let result = ''

    const applyMarkDown = (e: string) => {

        if (e.length === 0)
            return '<br/>'

        let arg: RegExpExecArray | null

        
        const re = /\[(?<link>(?:.*?))\]\((?<url>(?:.*?))\)/gm
        arg = re.exec(e) 
        console.log(arg)

        if(arg) {
            if(arg.input.indexOf('!') === 0)
                e = e.replace(arg.input, `<img src='${arg.groups?.url || ''}'/>`)
            else
                e = e.replace(arg.input, `<a href='${arg.groups?.url || ''}' target='_blank'>${arg.groups?.link || ''}</a>`)
        }

        do {
            const re = RegExp('_(.*?)(.*?)_')
            arg = re.exec(e)
            if(arg?.length === 3)
                e = e.replace(arg[0], `<i>${arg[2]}</i>`)
            
        } while (arg && arg.length === 3);

        do {
            const re = RegExp('\\*\\*(.*?)(.*?)\\*\\*')
            arg = re.exec(e)
            if(arg?.length === 3)
                e = e.replace(arg[0], `<b>${arg[2]}</b>`)
            
        } while (arg && arg.length === 3);

        do {
            const re = RegExp('`(.*?)(.*?)`')
            arg = re.exec(e)
            if(arg?.length === 3)
                e = e.replace(arg[0], `<i>${arg[2]}</i>`)
            
        } while (arg && arg.length === 3);

        if (e.substring(0, 1) === '#') {

            for(let i = 1; i <= 6; i++) {
                if(e.substring(0, i+1) === new Array(i+1).join('#') + ' ')
                    return `<h${i}>${'\t' + e.substring(i+1) + '\n'}</h${i}><hr/><br/>`
            }

        }
        else if (e === '---')
            return '<hr>'
        else if (e.indexOf('  ') > 0)
            return `<p>${e}<p/><br/>`

        return `<p>${e}<p/>`
    }

    text.length > 0 && lines.forEach((e, i) => {
        result += applyMarkDown(e) + '\n'
    })

    return result
}

const MarkDown = () => {

    const [text, setText] = useState('')

    return <main>
        <div style={{display: 'flex', minHeight: '600px'}}>
            <textarea style={{width: viewWidth}} value={text} onChange={(e) => setText(e.currentTarget.value)}></textarea>
            <MDView md={convertToMarkDown(text)}></MDView>
            <DebugView md={convertToMarkDown(text)}></DebugView>
        </div>
    </main>
}

export default MarkDown