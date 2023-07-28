import Image from "next/image"
import { useState } from "react"

const Index = () => {

    const [image, setImage] = useState<{url: string, width: number, height: number}>()

    const getCat = async () => {
        const cat = await fetch(`https://api.thecatapi.com/v1/images/search?api_key=${process.env.CAT_KEY || ''}`, {})
        .then(r => r.json())

        setImage(cat[0])

        console.log(cat[0].url)

    }

    return (
        <>
            <div style={{display: 'flex', alignContent: 'center', justifyContent: 'center', margin: '20px'}}>
                <button style={{width: '20em', padding: '10px'}} onClick={() => getCat()}>Get Cat</button>
            </div>
            {image && <img src={image.url} width={'100%'} alt="cat"></img>}
        </>
    )
}

export default Index