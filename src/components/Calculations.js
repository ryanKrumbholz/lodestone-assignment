import React from 'react';
import data from '../assets/data.json';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';
const table = data.table;

//returns ResponsiveLine from params. 
const agreementRateDaily = (dates, dailyData) => {

    //User defined sorting function to sort dates list in ascending order
    const compare = (a, b) => {
        //if statements on lines 14, 17, 20 determine if dates being compared are single or double digit.
        //If one date is single digit and the other is double digit, it can be determined that one date is lesser than the other.
        if (a.length < b.length) {
            return -1;
        }

        if (a.length > b.length) {
            return 1;
        }

        if (a.length === b.length) {
            let numA;
            let numB;

            //Determines whether day is single digit or double digit to parse appropriate characters.
            //Compares two ints after they have been parsed.
            if (a[4] === '/') {

                numA = parseInt(a[3]);
                numB = parseInt(b[3]);

            }

            else {

                numA = parseInt(a[3] + a[4]);
                numB = parseInt(b[3] + b[4]);

            }

            if (numA < numB) {

                return -1;

            }

            return 1;

        }

        return 0;

    }

    //Formats data for Nivo ResponsiveLine graph
    const makeData = (dates, dailyData) => {

        let data = [{

            id: "Agreement Rate", //for graph legend
            color: "hsl(246, 70%, 50%)", //graph color
            data: [] //graph data

        }];

        //loop pushes formatted data to 'data'
        for (let i = 0; i < dates.length; i++) {

            const currDate = dates[i];
            data[0].data.push({
                x: i + 1, //x-coordinate: date
                y: dailyData.get(currDate).rate * 100 //y-coordinate: agreement rate

            });
        }

        return data;
    
    };

    dates.sort(compare); //sorting dates by day
    const data = makeData(dates, dailyData);
    return (

        MyResponsiveLine({data})

    );
};

//Returns RaterID with highest agreement rate and the associated number of correct rates
const calcAgreementRateMax = (raterIDs, raters) => {

    let maxRater = raterIDs[0];
    let maxCount = raters.get(maxRater).numCorrectTask;
    
    for (let i = 1; i < raterIDs.length; i++) {

        const currRater  = raterIDs[i];
        const currCount = raters.get(currRater).numCorrectTask;

        //comparing current iterations count and updating max vals accordingly
        if (currCount > maxCount) { 

            maxCount = currCount;
            maxRater = currRater;

        }
    }

    return [maxRater, maxCount];
    
};

//Returns RaterID with lowest agreement rate and the associated number of correct rates
const calcAgreementRateMin = (raterIDs, raters) => {

    let minRater = raterIDs[0];
    let minCount = raters.get(minRater).numCorrectTask;
    
    for (let i = 1; i < raterIDs.length; i++) {

        const currRater  = raterIDs[i];
        const currCount = raters.get(currRater).numCorrectTask;

        //comparing current iterations count and updating min vals accordingly
        if (currCount < minCount) { 

            minCount = currCount;
            minRater = currRater;

        }
    }

    return [minRater, minCount];

};

//Returns data relevant to calculation and visualization functions after parsing JSON file.
const getRelevantData = () => {

    let raters = new Map(); //used hashmap because access is constant runtime
    let dailyData = new Map(); //used hashmap because access is constant runtime
    let labelData = new Map (); //used hashmap because access is constant runtime
    let dates = [];
    let raterIDs = [];
    let labels = [];

    //parses relevant data from JSON file
    for (let i = 0; i < table.length; i++) {

        const currRater = table[i].raterID;
        const compare3 = table[i].compare3 === 'match'; //boolean based on rater agreement
        const compare5 = table[i].compare5 === 'match'; //boolean based on rater agreement
        const incrementCorrectTask = (compare3 === compare5) ? 1 : 0; //num used to increment num of correct task if overall agreement is true
        const currDate = table[i].date;
        const currLabel = table[i].correctAnsw5;
        const correctlyIdentified = (compare5) ? 1 : 0; //num used to increment num of correctly Identified labels
        const incorrectlyIdentified = (!compare5) ? 1 : 0;//num used to increment num of incorrectly indentified labels

        //checking if currRater exist in Map and updating it accordingly if so.
        if (raters.has(currRater)) {

            const currCount  = raters.get(currRater).numTask;
            const currCorrectCount = raters.get(currRater).numCorrectTask;

            raters.set(currRater, {

                numTask: currCount + 1,
                numCorrectTask: currCorrectCount + incrementCorrectTask

            });
        }

        //creates new key and value in map
        else {

            raters.set(currRater, {

                numTask : 1,
                numCorrectTask: incrementCorrectTask

            });

            raterIDs.push(currRater);

        }

        //checks Map for key with current date and updates numTask, numCorrectTask, and rate
        if (dailyData.has(currDate)) {

            const currCount = dailyData.get(currDate).numTask;
            const currCorrectCount = dailyData.get(currDate).numCorrectTask;

            dailyData.set(currDate,{

                numTask: currCount + 1,
                numCorrectTask: currCorrectCount + incrementCorrectTask,
                rate: (currCorrectCount + incrementCorrectTask)/(currCount + 1)

            })

        }

        //adds new key and values in Map
        else {

            dailyData.set(currDate,{

                numTask: 1,
                numCorrectTask: incrementCorrectTask,
                rate: incrementCorrectTask/1

            })

            dates.push(currDate);

        }

        //checks if currLabel is in Map and updates values
        if (labelData.has(currLabel)) {

            const currNumCI = labelData.get(currLabel).numCorrectlyIdentified;
            const currNumII = labelData.get(currLabel).numIncorrectlyIdentified;
            const currNumIC = labelData.get(currLabel).numIncorrectlyChosen;

            labelData.set(currLabel, {

                numCorrectlyIdentified: currNumCI + correctlyIdentified,
                numIncorrectlyIdentified: currNumII + incorrectlyIdentified,
                numIncorrectlyChosen: currNumIC

            })

            //updates wrong answer's values so it can be used to calculate precision
            if (incorrectlyIdentified === 1) {

                const wrongAns = table[i].raterAnsw5;

                if (labelData.has(wrongAns)) {

                    labelData.get(wrongAns).numIncorrectlyChosen += 1;

                }

                //if wrongAns is not already in Map, creates new key and values in Map to prevent dupes and to count num times it has been incorrectly chosen to calc precision
                else {

                    labelData.set(wrongAns, {

                        numCorrectlyIdentified: 0,
                        numIncorrectlyIdentified: 0,
                        numIncorrectlyChosen: 1

                    })

                    labels.push(wrongAns)

                }
            }
        }

        //creates new key and associated values in Map
        else {

            labelData.set(currLabel, {

                numCorrectlyIdentified: correctlyIdentified,
                numIncorrectlyIdentified: incorrectlyIdentified,
                numIncorrectlyChosen: 0

            })
            
            labels.push(currLabel)

        }

    }

    //probably should have used a JSON obj, but this gets the job done 
    return [raterIDs,raters, dailyData, dates, labelData, labels];

}

//returns rater with highest num of task and num of task
const calcRaterTaskMax = (raterIDs, raters) => {

    let maxRater = raterIDs[0];
    let maxCount = raters.get(maxRater).numTask;
    
    for (let i = 1; i < raterIDs.length; i++) {

        const currRater  = raterIDs[i];
        const currCount = raters.get(currRater).numTask;

        if (currCount > maxCount) { 

            maxCount = currCount;
            maxRater = currRater

        }
        
    }

    return [maxRater, maxCount];

}

//returns rater with lowest num of task and num of task
const calcRaterTaskMin = (raterIDs, raters) => {

    let minRater = raterIDs[0];
    let minCount = raters.get(minRater).numTask;
    
    for (let i = 1; i < raterIDs.length; i++) {

        const currRater  = raterIDs[i];
        const currCount = raters.get(currRater).numTask;

        if (currCount < minCount) { 

            minCount = currCount;
            minRater = currRater

        }

    }

    return [minRater, minCount];

}

//returns bar graph after calculating precision from given params
const calcPrecision5 = (labels, labelData) => {
    // formula: x correctly identified / (x correctly identified + others incorrectly identified as x)

    //formats data for bar graph
    const makeData = (labels, labelData) => {

        let data = []

        for (let i = 0; i < labels.length; i++) {

            const currLabel = labels[i];
            const numCorrectlyIdentified = labelData.get(currLabel).numCorrectlyIdentified
            const numIncorrectlyChosen = labelData.get(currLabel).numIncorrectlyChosen
            const calc = numCorrectlyIdentified / (numCorrectlyIdentified + numIncorrectlyChosen) //calculation for precision

            data.push({

                label: currLabel,
                value: calc,
                "value color": "hsl(241, 70%, 50%)"

            })
        }

        return data;

    }

    labels = ['Bad', 'Okay', 'Intermediate', 'Great', 'Exceptional']
    const data = makeData(labels, labelData);

    return (

        MyResponsiveBar({data})

    )

}

//returns bar graph after calculating recall from given params
const calcRecall5 = (labels, labelData) => {
    // formula: x correctly identified / (x correctly identified + x incorrectly Identified as other)

    //formats data for bar graph
    const makeData = (labels, labelData) => {

        let data = []

        for (let i = 0; i < labels.length; i++) {

            const currLabel = labels[i];
            const numCorrectlyIdentified = labelData.get(currLabel).numCorrectlyIdentified
            const numIncorrectlyIdentified = labelData.get(currLabel).numIncorrectlyIdentified
            const calc = numCorrectlyIdentified / (numCorrectlyIdentified + numIncorrectlyIdentified) //calculates recall
            
            data.push({

                label: currLabel,
                value: calc,
                "value color": "hsl(241, 70%, 50%)"

            })
        }

        return data;

    }

    labels = ['Bad', 'Okay', 'Intermediate', 'Great', 'Exceptional']
    const data = makeData(labels, labelData);

    return (

        MyResponsiveBar({data})

    )

}

//Responsive Line configuration
const MyResponsiveLine = ({ data /* see data tab */ }) => (
    <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'days',
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'rate (percentage)',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        colors={{ scheme: 'nivo' }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabel="y"
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
)

//Responsive bar configuration
const MyResponsiveBar = ({ data /* see data tab */ }) => (
    <ResponsiveBar
        data={data}
        keys={['value']}
        indexBy="label"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        colors={{ scheme: 'nivo' }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#38bcb2',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: '#eed312',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: 'bad'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'okay'
                },
                id: 'lines'
            }
        ]}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Label',
            legendPosition: 'middle',
            legendOffset: 32
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Percentage',
            legendPosition: 'middle',
            legendOffset: -40
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
    />
)

const Calculations = () => {

    const countData = getRelevantData(); //data for calculations and visualization
    const raters = countData[1];
    const raterIDs = countData[0];
    const labels = countData[5];
    const labelData = countData[4];
    const maxTask = calcRaterTaskMax(raterIDs, raters);
    const minTask = calcRaterTaskMin(raterIDs, raters);
    const maxCorrectTask = calcAgreementRateMax(raterIDs, raters)
    const minCorrectTask = calcAgreementRateMin(raterIDs, raters)
    const maxRate = maxCorrectTask[1]/raters.get(maxCorrectTask[0]).numTask * 100;
    const minRate = minCorrectTask[1]/raters.get(minCorrectTask[0]).numTask * 100;
    let dates = countData[3];
    const dailyData = countData[2];

    return(

        <div style={{height: 500}}>
            {/* Height needs to be set to a value to ensure graphs render */}
            <h1>Calculations:</h1>
            <h2>Daily Agreement Rate Visualized</h2>
            {agreementRateDaily(dates, dailyData)}
            <h2>Precision Visualized</h2>
            {calcPrecision5(labels, labelData)}
            <h2>Recall Visualized</h2>
            {calcRecall5(labels, labelData)}
            <p>{`Rater ${maxTask[0]} completed the most task at ${maxTask[1]}.`}</p>
            <p>{`Rater ${minTask[0]} completed the least task at ${minTask[1]}.`}</p>
            <p>{`Rater ${maxCorrectTask[0]} had the highest agreement rate at ${maxRate}%.`}</p>
            <p>{`Rater ${minCorrectTask[0]} had the lowest agreement rate at ${minRate}%.`}</p>
            <h3>Q: Given your answer, what approaches do you recommend you need to take to improve
            your metrics, if the metric has not met engineering standards? 
            </h3>
            <p>Due to engineering standards not being met, I would implement an incentive based system to improve metrics. This would hopefully incentivize raters to more accurately label.</p>
            <h3>
                Q: Identify 3 more potential questions to consider that can be used to identify
                issues among raters.
            </h3>
            <p>
            1. What is the accuracy for each of the 5 labels?<br/>
            2. What is the F score for each of the 5 labels?<br/>
            3. What is the difference in overall accuracy between the 5 labels and 3 labels?
            </p>
        </div>

    )
}

export default Calculations;