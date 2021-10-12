const apiGenerate = "https://inspirobot.me/api/?generate=true"
const apiShirt = "https://www.zazzle.com/api/create/at-238345400854864357?rf=238345400854864357&ax=Linkover&pd=235061802116120255&ed=true&tc=&ic=&t_image1_iid="
const apiPoster = "https://www.zazzle.com/api/create/at-238345400854864357?rf=238345400854864357&ax=Linkover&pd=228590189623826427&ed=true&tc=&ic=&t_image1_iid="
const apiMug = "https://www.zazzle.com/api/create/at-238345400854864357?rf=238345400854864357&ax=Linkover&pd=168786918953473601&fwd=ProductPage&ed=true&tc=&ic=&t_image0_iid="
const apiSticker = "https://www.zazzle.com/api/create/at-238345400854864357?rf=238345400854864357&ax=Linkover&pd=217733734804879028&fwd=ProductPage&ed=true&tc=&ic=&t_image0_iid="
const apiPrint = "https://www.zazzle.com/api/create/at-238345400854864357?rf=238345400854864357&ax=Linkover&pd=168786918953473601&fwd=ProductPage&ed=true&tc=&ic=&t_image0_iid="
const apiMask = "https://www.zazzle.com/api/create/at-238345400854864357?rf=238345400854864357&ax=Linkover&pd=256892358620469219&fwd=ProductPage&ed=true&tc=&ic=&t_image1_iid="


class Zazzle {
    shirt: string
    poster: string
    mug: string
    sticker: string
    print: string
    mask: string

    constructor(shirt: string, poster: string, mug: string,
                sticker: string, print: string, mask: string) {
        this.shirt = shirt
        this.poster = poster
        this.mug = mug
        this.sticker = sticker
        this.print = print
        this.mask = mask
    }
}

class InspiroBotImage {
    image: string
    zazzle: Zazzle

    constructor(image: string, zazzle: Zazzle) {
        this.image = image
        this.zazzle = zazzle
    }
}

function getZazzleApiUrls(imageUrl: string): Zazzle {
    let shirt = apiShirt + imageUrl
    let poster = apiPoster + imageUrl
    let mug = apiMug + imageUrl
    let sticker = apiSticker + imageUrl
    let print = apiPrint + imageUrl
    let mask = apiMask + imageUrl

    return new Zazzle(shirt, poster, mug, sticker, print, mask)
}

async function generate(): Promise<string> {
    let resp = await fetch(apiGenerate)
    return await resp.text()
}

export async function getInspiroBotData(): Promise<InspiroBotImage> {
    let imageUrl = await generate()
    let zazzle = getZazzleApiUrls(imageUrl)
    return new InspiroBotImage(imageUrl, zazzle)
}
