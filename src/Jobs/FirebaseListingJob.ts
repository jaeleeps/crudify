import { createReadStream } from 'fs';
import * as csvParser from 'csv-parser';
import { Listing } from "./AirbnbDataModels.interface";
import { testFirebaseConfig } from "../../__test__/env/testFirebaseConfig";
import firebase from 'firebase';
import * as async from 'async';

const filePath = 'listings.csv';

function processRow(row: any): Listing {
    return {
        id: parseInt(row.id, 10),
        listing_url: row.listing_url,
        name: row.name,
        description: row.description,
        neighbourhood_review: row.neighborhood_overview,
        picture_url: row.picture_url,
        host_id: row.host_id,
        host_url: row.host_url,
        host_name: row.host_name,
        host_location: row.host_location,
        host_response_time: row.host_response_time,
        neighbourhood: row.neighbourhood,
        bathrooms: parseFloat(row.bathrooms),
        beds: parseInt(row.beds, 10),
        number_of_reviews: parseInt(row.number_of_reviews, 10),
        review_scores_rating: parseFloat(row.review_scores_rating),
        review_scores_accuracy: parseFloat(row.review_scores_accuracy),
        review_scores_cleanliness: parseFloat(row.review_scores_cleanliness),
        review_scores_checkin: parseFloat(row.review_scores_checkin),
        review_scores_location: parseFloat(row.review_scores_location),
        review_scores_value: parseFloat(row.review_scores_value),
        reviews_per_month: parseFloat(row.reviews_per_month),
    };
}

function parseLargeCSV(
    path: string,
    onRowParsed: (row: Listing, callback: (err: Error | null) => void) => void
): void {
    const q = async.queue(onRowParsed, 10); // Adjust concurrency value if needed

    createReadStream(path)
        .pipe(csvParser())
        .on('data', (row: any) => {
            const parsedRow = processRow(row);
            q.push(parsedRow, (err) => {
                if (err) console.error('Error processing row:', err);
            });
        })
        .on('end', () => {
            q.drain(() => {
                console.log('CSV file successfully processed.');
            });
        });
}

// This function will be called for each parsed row
async function handleParsedRow(row: Listing, callback: (err: Error | null) => void): Promise<void> {
    const db = firebase.firestore();
    try {
        const docRef = await db.collection('Listings').doc(row.id.toString());
        await docRef.set(row);
        console.log('Row inserted:', row.id);
        callback(null);
    } catch (err) {
        console.error('Error inserting row:', err);
        callback(err);
    }
}

// Start parsing the large CSV file
async function runJob(): Promise<void> {
    firebase.initializeApp(testFirebaseConfig);

    const onRowParsed = async (row: Listing, callback: (err: Error | null) => void) => {
        try {
            const db = firebase.firestore();
            const docRef = await db.collection('Listings').doc(row.id.toString());
            await docRef.set(row);
            console.log('Row inserted:', row.id);
            callback(null);
        } catch (err) {
            console.error('Error inserting row:', row);
            callback(err);
        }
    };

    parseLargeCSV(filePath, onRowParsed);

    process.on('exit', () => {
        console.log('Closing Firebase connection');
    });
}

runJob();
