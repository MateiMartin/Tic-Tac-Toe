import React, { useEffect } from "react";
import { MutatingDots } from 'react-loader-spinner'
import './WaitPage.css'

const WaitPage = ({ setRoute, route, setSocket, socket, room }) => {

    useEffect(() => {
        if (room?.user1Data && room?.user2Data)
            setRoute('game');
    }, [room]);

    return (
        <div className="wait-elm">
            <MutatingDots
                height="100"
                width="100"
                color="white"
                secondaryColor='blue'
                radius='20'
                ariaLabel="mutating-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
            <h1>WAITING FOR SOMEBODY...</h1>
        </div>
    )
}

export default WaitPage;