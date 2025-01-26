import { useSelector } from "react-redux";

export default function Settings() {
    const theme = useSelector(state => state.themeSlice.theme);
    console.log(theme);
    return (
        <div>Settings</div>
    );
}