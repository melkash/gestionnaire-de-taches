export default function logDev(...args) {
    if (process.env.NODE_ENV === 'development') {
        console.log(...args)
    }
}