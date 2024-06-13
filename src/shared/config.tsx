import * as CryptoJS from 'crypto-js'

const secretKey = import.meta.env.VITE_SEC_KEY ? import.meta.env.VITE_SEC_KEY : '12345'

export const encrypt = ( plainText: string ) => {
    const cipherText = CryptoJS.AES.encrypt(plainText, secretKey).toString()
    return cipherText
}

export const decrypt = ( cipherText:string ) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey )
    const plainText = bytes.toString(CryptoJS.enc.Utf8)
    return plainText
}

export const createSessionID = (length:any) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789=-_';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}