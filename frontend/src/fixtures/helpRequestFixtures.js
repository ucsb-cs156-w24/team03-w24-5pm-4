const helpRequestFixtures = {
    oneHelpRequest: {
        "id": 1,
        "requesterEmail": "test01@gmail.com",
        "teamId": "w24-5pm-4",
        "tableOrBreakoutRoom": "Table 1",
        "requestTime": "2024-02-10T12:00:00",
        "explanation": "Test Help Request 01",
        "solved": 'true'
    },
    threeHelpRequests: [
        {
            "id": 1,
            "requesterEmail": "test11@gmail.com",
            "teamId": "w24-5pm-4",
            "tableOrBreakoutRoom": "Table 1",
            "requestTime": "2024-02-15T12:00:00",
            "explanation": "Test Help Request 11",
            "solved": 'true'
        },
        {
            "id": 2,
            "requesterEmail": "test12@gmail.com",
            "teamId": "w24-5pm-4",
            "tableOrBreakoutRoom": "Table 2",
            "requestTime": "2024-02-15T12:00:00",
            "explanation": "Test Help Request 12",
            "solved": 'false'
        },
        {
            "id": 3,
            "requesterEmail": "test13@gmail.com",
            "teamId": "w24-5pm-4",
            "tableOrBreakoutRoom": "Table 3",
            "requestTime": "2024-02-15T12:00:00",
            "explanation": "Test Help Request 13",
            "solved": 'true'
        }
    ]
};


export { helpRequestFixtures };