let i = 0

/** get material color */
export const getColor = () => {
    const fillOptions = ['#327786', '#429EB3', '#97CCD8', '#225059'] //['#F15152', '#084C61', '#D1BECF']
    const accents = ['#F7E08D', '#F29195', '#BEE5BF', '#A989A8']
    const period = 7
    const fillStyle =
        i % period || i === 0
            ? fillOptions[
            Math.floor(fillOptions.length * Math.random())
            ]
            : accents[(i / period - 1) % accents.length]
    i++

    return fillStyle
}