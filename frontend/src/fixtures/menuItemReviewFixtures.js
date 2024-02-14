const menuItemReviewFixtures = {
    oneReview: {
        "id": 47,
        "itemId": 7,
        "reviewerEmail" : "cgaucho@ucsb.edu",
        "stars": 5,
        "comments": "I love the Apple Pie",
        "dateReviewed": "2022-01-02T12:00:00"
    },
    threeReviews: [
        {
            "id": 47,
            "itemId": 7,
            "reviewerEmail" : "cgaucho@ucsb.edu",
            "stars": 5,
            "comments": "I love the Apple Pie",
            "dateReviewed": "2022-01-02T12:00:00"
        },
        {
            "id": 53,
            "itemId": 7,
            "reviewerEmail" : "ldelplaya@ucsb.edu",
            "stars": 0,
            "comments": "I hate the Apple Pie",
            "dateReviewed": "2022-02-02T13:00:00"
        },
        {
            "id": 1,
            "itemId": 2,
            "reviewerEmail" : "ldelplaya@ucsb.edu",
            "stars": 5,
            "comments": "I like the Banana Pie",
            "dateReviewed": "2022-01-12T12:00:00"
        }
    ]
};


export { menuItemReviewFixtures };