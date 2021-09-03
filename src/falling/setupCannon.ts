import * as CANNON from 'cannon-es'
import * as Vue from 'vue'
import * as THREE from 'three'

export default () => {
    // build world
    const world = new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.82, 0),
    })

    const restitution = 1

    // add floor
    const groundBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
        material: new CANNON.Material({
            restitution,
        }),
    })
    groundBody.position.y = -3
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
    world.addBody(groundBody)

    // // add walls
    // for (let i = 0; i < 2; i++) {
    //     const wall = new CANNON.Body({
    //         type: CANNON.Body.STATIC,
    //         shape: new CANNON.Plane(),
    //         material: new CANNON.Material({
    //             restitution,
    //         }),
    //     })
    //     // wall.quaternion.setFromEuler(0, 0, i === 0 ? -Math.PI : 0) // make it face up
    //     wall.position.x = i === 0 ? -100 : 100
    //     world.addBody(wall)
    // }
    for (let i = 0; i < 2; i++) {
        const wall = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Plane(),
            material: new CANNON.Material({
                restitution,
            }),
        })
        wall.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), i === 0 ? Math.PI / 2 : Math.PI / -2)
        wall.position.x = i === 0 ? -5 : 5
        world.addBody(wall)

    }


    // build update function
    const timeStep = 1 / 60
    let lastCallTime: undefined | number
    const physicsUpdate = (before?: () => void, after?: () => void) => {
        if (before) before()

        const time = performance.now() / 1000

        if (!lastCallTime) {
            world.step(timeStep)
        } else {
            const dt = time - lastCallTime
            world.step(timeStep, dt)
        }
        lastCallTime = time

        if (after) after()
    }

    return { physicsUpdate, world }
}