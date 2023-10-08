interface CardProps {
    image : string,
    slot : string
}

import './card.css'
import { MultipleButtons } from '../button/multiplebuttons'

export function Card(props : CardProps) {

    return (
        <div className="cardAbility text-center">
            <p>{props.slot}</p>
            <img src={props.image}/>
            <MultipleButtons/>
        </div>
    )

}

