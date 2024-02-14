const menuItemReviewFixtures = {
    oneReview: {
        "id": 47,
        "itemId": 7,
        "reviewerEmail" : "cgaucho@ucsb.edu",
        "stars": 5,
        "dateReviewed": "2022-01-02T12:00:00",
        "comments": "I love the Apple Pie"
    },
    threeReviews: [
        {
            "id": 47,
            "itemId": 7,
            "reviewerEmail" : "cgaucho@ucsb.edu",
            "stars": 5,
            "dateReviewed": "2022-01-12T12:00:00",
            "comments": "I love the Apple Pie"
        },
        {
            "id": 53,
            "itemId": 7,
            "reviewerEmail" : "ldelplaya@ucsb.edu",
            "stars": 0,
            "dateReviewed": "2022-01-12T12:00:00",
            "comments": "I hate the Apple Pie"  
        },
        {
            "id": 1,
            "itemId": 2,
            "reviewerEmail" : "ldelplaya@ucsb.edu",
            "stars": 5,
            "dateReviewed": "2022-01-12T12:00:00",
            "comments": "I like the Banana Pie"
        },
    ]
};


export { menuItemReviewFixtures };