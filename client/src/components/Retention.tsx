import React, { useState, useEffect } from "react";
import { httpClient } from '../utils/asyncUtils';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { weeklyRetentionObject, CustomizedTablesType } from '../models/event';
import moment from 'moment'

export const OneHour: number = 1000 * 60 * 60;
export const OneDay: number = OneHour * 24
export const OneWeek: number = OneDay * 7

const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }),
)(TableRow);

const useStyles = makeStyles((theme: Theme) => ({
    table: {
        minWidth: 700,
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        alignItems: "center",
        overflow: 'auto',
        height: '600px',
        width: '900px',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));


const RetentionCohort: React.FC = () => {
    const todayStart = moment().startOf('day')
    const startDate = todayStart.subtract(5, 'week').valueOf();
    const classes = useStyles();
    const [chartsData, setChartsData] = useState<weeklyRetentionObject[] | undefined>()
    const [dayZero, setDayZero] = useState<number>(startDate)

    const fetchChartsData = async () => {
        const { data }: { data: weeklyRetentionObject[] | undefined } = await httpClient.get(`http://localhost:3001/events/retention?dayZero=${dayZero}`);
        setChartsData(data);
    }

    useEffect(() => {
        fetchChartsData()
    }, [dayZero])

    const changeDate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const zero: number = new Date(e.target.value).valueOf()
        if (zero > Date.now().valueOf()) {
            alert('Invalid Date')
            setDayZero(0)
            e.target.value = new Date(Date.now()).toDateString()
        } else {
            setDayZero(zero)
        }
    }

    return (<>
        <div className={classes.container} >
            <h1>Retention Cohort Week</h1>
            <TextField
                id="date"
                label="Pick Offset Day"
                type="date"
                defaultValue=''
                className={classes.textField}
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={changeDate}
            />
            {chartsData &&
                <CustomizedTables chartsData={chartsData} />
            }
        </div>
    </>);
}

function CustomizedTables({ chartsData }: { chartsData: weeklyRetentionObject[] | undefined }) {
    const classes = useStyles();
    const [allUserReduce, setAllUserReduce] = useState<CustomizedTablesType>([])


    useEffect(() => {
        const allRetentions = chartsData!.map((element) => element.weeklyRetention)
        const newArr: number[] = allRetentions.map((elem: CustomizedTablesType, index: number) => {
            if (index === 0) {
                return 100
            } else {
                const spec: (number | undefined)[] = allRetentions.map((retention: number[]) => {
                    if (retention[index]) {
                        return retention[index]
                    }
                }).filter((element: number | undefined) => !(!element))
                if (spec.length > 0) {
                    return spec.reduce((sum: number, present: number | undefined) => {
                        return sum + present!
                    }, 0) / spec!.length
                } else {
                    return 0
                }
            }
        }
        )

        let roundedArray = newArr.map((percent: number) => {
            return Math.round(percent)
        })
        setAllUserReduce(roundedArray)
    }, [chartsData])

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell></StyledTableCell>
                        {chartsData!.length > 0 && chartsData!.map((week: weeklyRetentionObject): JSX.Element =>
                            <StyledTableCell>Week {week.registrationWeek}</StyledTableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <StyledTableRow >
                        <StyledTableCell component="th" scope="row">
                            All Users <br /> {chartsData!.reduce((sum: number, present: weeklyRetentionObject) => {
                            return sum + present.newUsers
                        }, 0)}
                        </StyledTableCell>
                        {allUserReduce && allUserReduce.map((percent: number, index: number) => (
                            <StyledTableCell key={`${percent}, ${index}`} style={+percent > 80 ? { backgroundColor: '#3D5A80', color: 'white' } : +percent > 40 ? { backgroundColor: '#98C1D9' } : { backgroundColor: '#E0FBFC' }} align="right">{percent}%</StyledTableCell>
                        ))}
                    </StyledTableRow>
                    {chartsData!.map((row: weeklyRetentionObject): JSX.Element => (
                        <StyledTableRow key={row.start}>
                            <StyledTableCell component="th" scope="row">
                                {row.start}-{row.end}<br />{row.newUsers} Users
                            </StyledTableCell>
                            {row.weeklyRetention && row.weeklyRetention.map((percent: number, index) =>
                                <StyledTableCell key={`${percent}, ${index}`} style={+percent > 80 ? { backgroundColor: '#3D5A80', color: 'white' } : +percent > 40 ? { backgroundColor: '#98C1D9' } : { backgroundColor: '#E0FBFC' }} align="right">{percent}%</StyledTableCell>)}
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}


export default RetentionCohort