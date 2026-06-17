export const useGetAspectRatio = ()=>{
    const gcd = (a:number, b:number) => {
        return b
            ? gcd(b, a % b)
            : a;
    };

    const aspectRatio = (width:number, height:number)  => {
        const divisor = gcd(width, height);

        return `${width / divisor}:${height / divisor}`;
    };
    return {aspectRatio};
}