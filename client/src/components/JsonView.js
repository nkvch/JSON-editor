import React, { useEffect, useState } from 'react';


const JsonView = (props) => {

    const [obj, setObj] = useState({});
    const comma = props.comma;
    const [keys, setKeys] = useState([]);
    const [show, setShow] = useState(props.show || false);

    useEffect(() => {
        setObj(props.obj)
        setKeys(Object.keys(props.obj));
    }, [props.obj]);

    const childChanged = (key, value) => {
        const changedValue = {
            [key]: value
        };

        props.notifyParent(props.name, {
            ...obj,
            ...changedValue,
        });
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        const changedValue = {
            [name]: value
        };
        
        props.notifyParent(props.name, {
            ...obj,
            ...changedValue,
        });
        
    }

    const handleBooleanChange = (event) => {
        const name = event.target.name;
        const value = event.target.checked;
        
        const changedValue = {
            [name]: value
        };

        props.notifyParent(props.name, {
            ...obj,
            ...changedValue,
        });
    }

    const handleNumberChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        
        const changedValue = {
            [name]: Number(value)
        };
        
        props.notifyParent(props.name, {
            ...obj,
            ...changedValue,
        });
    }


    return (
        <div className="d-inline-block ps-1">
        <div className="d-inline-block">
        <button className="my-button" onClick={() => {setShow(!show)}}>
        {show 
        ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
        </svg> 
        : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
        </svg>
        }
        </button>
        </div>
        {'{'}
            {
                show
            ? <div className="d-flex">
            <div className="px-2">
            </div>
            <div>
            {
                keys.map((key, idx) => {
                return (
                    <div key={idx}>{
                        typeof obj[key] === 'object' && !Array.isArray(obj[key])
                        && <div className="d-flex">
                            <div className="d-inline-block">{`${key}: `}</div>
                            <JsonView obj={obj[key]} 
                            comma={idx !== keys.length - 1}
                            name={key} 
                            notifyParent={childChanged}
                            />
                        </div>
                        }
                        {
                            Array.isArray(obj[key])
                            && <div className="d-flex">
                                <div className="d-inline-block">{`${key}: `}</div>
                                <ArrayView array={obj[key]} 
                                comma={idx !== keys.length - 1}
                                name={key} 
                                notifyParent={childChanged}
                                />
                            </div>
                        }
                        {
                            typeof obj[key] === 'boolean'
                            && <div className="d-inline-block form-check form-switch px-0">
                            <label className="form-check-label">{`${key}: `}</label>
                            <input name={key}
                             type="checkbox" 
                             checked={obj[key]} 
                             value={obj[key]} 
                             className="form-check-input float-none ms-3"
                             onChange={handleBooleanChange}
                             ></input>
                            <div className="d-inline-block">{(idx !== keys.length - 1) && ','}</div>
                            </div>
                        }
                        {
                            typeof obj[key] === 'number'
                            && <div className="d-inline-block">
                            <label className="form-label">{`${key}: `}</label>
                            <input 
                            className="form-control d-inline-block ms-2" 
                            name={key} 
                            type="number" 
                            value={obj[key]} 
                            onChange={handleNumberChange}></input>
                            {(idx !== keys.length - 1) && ','}</div>
                        }
                        {
                            typeof obj[key] === 'string' && /^#\w\w\w\w\w\w$/.test(obj[key])
                            && <div className="d-inline-block">
                            <label className="form-label">{`${key}: `}</label>
                            <input
                            className="d-inline-block ms-2"
                            name={key}
                            type="color"
                            value={obj[key]}
                            onChange={handleChange}
                            >
                            </input>
                            </div>
                        }
                        {
                            typeof obj[key] === 'string' && !/^#\w\w\w\w\w\w$/.test(obj[key])
                            && <div className="d-inline-block">
                            <label className="form-label">{`${key}: `}</label>
                            <input 
                            className="form-control d-inline-block ms-2" 
                            name={key} 
                            type="text" 
                            value={obj[key]} 
                            onChange={handleChange}></input>
                            {(idx !== keys.length - 1) && ','}</div>
                        }
                    </div>
                )
            })
            }
            </div>
            </div>
            : '...'}
            { comma ? '},' : '}' }
        </div>
    )

}

const ArrayView = (props) => {

    const [array, setArray] = useState([]);
    const comma = props.comma;
    const [show, setShow] = useState(false);

    useEffect(() => {
        setArray(props.array);
    }, [props.array]);

    const childChanged = (idx, value) => {
        const changed = [...array];
        changed[idx] = value;

        props.notifyParent(props.name, changed);

    }

    const handleChange = (event) => {
        const idx = event.target.name;
        const value = event.target.value;
        const changed = [...array];
        changed[idx] = value;

        props.notifyParent(props.name, changed);

    }

    const handleBooleanChange = (event) => {
        const idx = event.target.name;
        const value = event.target.checked;
        const changed = [...array];
        changed[idx] = value;

        props.notifyParent(props.name, changed);

    }

    const handleNumberChange = (event) => {
        const idx = event.target.name;
        const value = event.target.value;
        const changed = [...array];
        changed[idx] = Number(value);

        props.notifyParent(props.name, changed);

    }

    const popItem = (idx) => {
        const changed = [...array];
        changed.splice(idx, 1);

        props.notifyParent(props.name, changed);

    }

    return (
        <div className="d-inline-block ps-1">
        <div className="d-inline-block">
        <button className="my-button" onClick={() => {setShow(!show)}}>
        {show 
        ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
        </svg> 
        : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
        </svg>
        }
        </button>
        </div>
            {'['}
            {
                show
                ? <div className="d-flex">
                    <div className="px-2">
                    </div>
                    <div>
                        {
                            show
                            ? array.map((item, idx) => {
                            return (
                                <div key={idx}>
                                    {
                                        typeof item === 'object' && !Array.isArray(item)
                                        && <div className="d-flex">
                                            <button className="my-button pop-button" onClick={() => popItem(idx)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                                            <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/>
                                            </svg>
                                            </button>
                                            <span>{`${idx}: `}</span>
                                            <JsonView obj={item} 
                                            comma={idx !== array.length - 1} 
                                            name={idx}
                                            notifyParent={childChanged}
                                            />
                                        
                                        </div>
                                    }
                                    {
                                        Array.isArray(item)
                                        && <div className="d-flex">
                                            <button className="my-button pop-button" onClick={() => popItem(idx)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                                            <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/>
                                            </svg>
                                            </button>
                                            <span>{`${idx}: `}</span>
                                            <ArrayView array={item} 
                                            comma={idx !== array.length - 1}
                                            name={idx}
                                            notifyParent={childChanged} />
                                            
                                        </div>
                                    }
                                    {
                                        typeof item === 'boolean'
                                        && <div className="d-inline-block form-check form-switch">
                                        <button className="my-button pop-button" onClick={() => popItem(idx)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                                        <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/>
                                        </svg>
                                        </button>
                                        <label className="form-label">{`${idx}: `}</label>
                                        <input name={idx}
                                         type="checkbox"
                                         checked={array[idx]}
                                         value={array[idx]} 
                                         onChange={handleBooleanChange}
                                         className="form-check-input"></input>
                                        {(idx !== array.length - 1) && ','}
                                        </div>
                                    }
                                    {
                                        typeof item === 'number'
                                        && <div className="d-inline-block">
                                        <button className="my-button pop-button" onClick={() => popItem(idx)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                                        <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/>
                                        </svg>
                                        </button>
                                        <label className="form-label">{`${idx}: `}</label>
                                        <input 
                                        className="form-control d-inline-block ms-2" 
                                        name={idx} 
                                        type="number" 
                                        value={array[idx]} 
                                        onChange={handleNumberChange}></input>
                                        {(idx !== array.length - 1) && ','}</div>
                                    }
                                    {
                                        typeof item === 'string'
                                        && <div className="d-inline-block">
                                        <button className="my-button pop-button" onClick={() => popItem(idx)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                                        <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/>
                                        </svg>
                                        </button>
                                        <label className="form-label">{`${idx}: `}</label>
                                        <input 
                                        className="form-control d-inline-block ms-2" 
                                        name={idx} 
                                        type="text" 
                                        value={array[idx]} 
                                        onChange={handleChange}></input>
                                        {(idx !== array.length - 1) && ','}</div>
                                    }
                                </div>
                            )
                        })
                        : <button className="" onClick={() => {setShow(!show)}}>{show ? '▼' : '▶'}</button>
                        }
                    </div>
                </div>
                : '...' }
            { comma ? '],' : ']' }
        </div>
    )
}

export default JsonView;