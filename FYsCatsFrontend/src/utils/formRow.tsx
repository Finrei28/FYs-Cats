
type formRowProps = {
    type: string;
    label: string;
    name: string;
    value?: string;
    handlechange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const formRow = ({type, label, name, value, handlechange}: formRowProps) => {
    return (
        <div className="form-row">
            <label htmlFor={name} className="form-label">
                {label}
            </label>
            <input
                type={type}
                value={value}
                name={name}
                onChange={handlechange}
                className="form-input"
            />
        </div>
    )
}

export default formRow