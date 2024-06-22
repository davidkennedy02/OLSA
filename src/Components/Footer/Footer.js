import s from './FooterStyle.module.css';

export default function Footer() {
    return (
        <div className={s.footer}>
            <p>Copyright @ 2024 OLSA Inc</p>
            <p>dk94@st-andrews.ac.uk</p>
            <p>Made with React</p>
        </div>
    )
}