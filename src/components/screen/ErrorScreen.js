import React from 'react';
import Card from '../main/Card';
import { links } from '../../links';

function ErrorScreen() {
    let body = <div>Something went wrong :/ <a href={links.contact} target='_blank'>Send a report</a></div>

    return (
        <div>
            <Card body={body}/>
        </div>
    );
}

export default ErrorScreen;