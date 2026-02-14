import './animation.css';
const Animation=(props)=>{
    const style={
        bottom: `${props.bottom?props.bottom:""}`,
    }
    console.log(style.bottom);
    return (<div className="area" >
    <ul className="circles">
            <li style={style}></li> {/* 1 */}
            <li style={style}></li> {/* 2 */}
            <li style={style}></li> {/* 3 */}
            <li style={style}></li> {/* 4 */}
            <li style={style}></li> {/* 5 */}
            <li style={style}></li> {/* 6 */}
            <li style={style}></li> {/* 7 */}
            <li style={style}></li> {/* 8 */}
            <li style={style}></li> {/* 9 */}
            <li style={style}></li> {/* 10 */}
            <li style={style}></li> {/* 11 */}
            <li style={style}></li> {/* 12 */}
            <li style={style}></li> {/* 13 */}
            <li style={style}></li> {/* 14 */}
            <li style={style}></li> {/* 15 */}
    </ul>
</div >)
}
export default Animation;