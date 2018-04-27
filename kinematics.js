function robot_trajectory(robot_log) {
    const tolerance = 1e-8;
    
    const wheel_radius = 2.7;
    const wheel_base = 15;
    const sonar_zero_distance = 13.8;
    
    const robot_traj = [];

    const velocity = 2.0 * 3.14 * wheel_radius / 360

    let last_x = 0;
    let last_y = 0;
    let last_angle = 0;
    let last_time = robot_log[0].time;
    let curr_x, curr_y, curr_angle, curr_time;

    for (let index = 0; index < robot_log.length; index++) {
        const log_element = robot_log[index];
        const dt = log_element.time - last_time;
 
        const left = velocity * log_element.left_speed;
        const right = velocity * log_element.right_speed;
        if (Math.abs(left - right) < tolerance) {
            curr_x = last_x + left * Math.cos(last_angle) * dt;
            curr_y = last_y + left * Math.sin(last_angle) * dt;
            curr_angle = last_angle;
        }else{
            const r = (wheel_base / 2) * ((right + left) / (right - left));
            const o_dt = dt * (right - left) / wheel_base;
            const iccx = last_x - r * Math.sin(last_angle)
            const iccy = last_y + r * Math.cos(last_angle)
            curr_x = Math.cos(o_dt) * (last_x - iccx) - Math.sin(o_dt) * (last_y - iccy) + iccx;
            curr_y = Math.sin(o_dt) * (last_x - iccx) + Math.cos(o_dt) * (last_y - iccy) + iccy;
            curr_angle = last_angle + o_dt;
        }
        robot_traj.push({time: log_element.time, x: curr_x, y: -1 * curr_y, angle: curr_angle})
        last_x = curr_x;
        last_y = curr_y;
        last_angle = curr_angle;
        last_time = log_element.time;
    }
    return robot_traj;
}

function guess(){
    const robot_traj = robot_trajectory(robot_log);
    const camera = ['Camera'].concat(camera_log.map(log => log.y));
    const robot = ['Robot'].concat(robot_traj.map(log => log.y));
    return [camera, robot];
}