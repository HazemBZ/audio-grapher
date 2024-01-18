// Ref:: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API

export function analyseAudio(analyser) {

    console.log('analyser analyser', analyser)

    analyser.fftSize = 2048
    const bufferLength = analyser.frequencyBinCount;
    // const bufferLength = 10;
    const dataArray = new Uint8Array(bufferLength)
    console.log('bufferLength', bufferLength)
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    /**
     * Canvas
     */
    draw()

    function draw() {
        const drawVisual = requestAnimationFrame(draw);


        analyser.getByteTimeDomainData(dataArray) // TOoo much processing for big files 
        console.log(dataArray)



        const { WIDTH, HEIGHT } = { WIDTH: canvas.width, HEIGHT: canvas.height }

        console.log(drawVisual)



        ctx.clearRect(0, 0, WIDTH, HEIGHT)

        ctx.fillStyle = "skyblue"
        ctx.fillRect(0, 0, WIDTH, HEIGHT)

        ctx.lineWidth = 2
        ctx.strokeStyle = "rgb(0 0 0)"


        const sliceWidth = WIDTH / bufferLength
        let x = 0

        ctx.beginPath()

        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * (HEIGHT / 2)
            if (i === 0) {
                ctx.moveTo(x, y)
            } else {
                ctx.lineTo(x, y)
            }

            x += sliceWidth
        }

        ctx.lineTo(WIDTH, HEIGHT / 2)
        ctx.stroke()
    }

}


