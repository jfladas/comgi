"use strict"



window.onload = function ()
{
    let canvas = document.getElementById ("myCanvas")
    let gl = canvas.getContext ("webgl")

    gl.clearColor (1.0, 0.0, 0.0, 1.0)
    gl.clear (gl.COLOR_BUFFER_BIT)
}
