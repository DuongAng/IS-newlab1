import React, {useEffect, useState} from "react";
import CollectionObjectsDataGrid from "./ObjectsTable.tsx";
import {
    Box,
    Button,
    ButtonGroup,
    Dialog, DialogActions, DialogContent,
    DialogTitle, InputLabel, MenuItem, Select, SelectChangeEvent,
    TextField, Typography,
} from "@mui/material";
import {ThemeProvider, createTheme} from '@mui/material/styles';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import SearchIcon from '@mui/icons-material/Search';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AlbumIcon from '@mui/icons-material/Album';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import axiosInstance from "../axiosConfig.ts";
import Notification from "./reusable/Notification.tsx";
import CustomAppBar from "./reusable/CustomAppBar.tsx";
import {BestAlbum, Coordinates, Genre, RowData, Studio} from "../interfaces.ts";
import axios from "axios";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});



const MainScreen: React.FC = () => {
    //настройки параметров в модальном окне ввода значений
    const [intModalValue, setIntModalValue] = useState<string>('');
    const [validationError, setValidationError] = useState(true);
    const [successRequest, setSuccessRequest] = useState(false)
    const [responseText, setResponseText] = useState<string>('')
    const [helperText, setHelperText] = useState('');
    const [isInformationalMessage, setIsInformationalMessage] = useState(false)
    const [requestError, setRequestError] = useState(false)

    const [selectedAwardBandId, setSelectedAwardBandId] = useState<number | undefined>(undefined);
    const [selectedGenre, setSelectedGenre] = useState<Genre | undefined>(undefined);
    const [openAwardDialog, setOpenAwardDialog] = useState(false);



    const [bands, setBands] = useState<RowData[]>([]);
    const [selectedBandId, setSelectedBandId] = useState<number | undefined>()

    const [openIndex, setOpenIndex] = useState<number>()


    const defaultResponseErrorMessage = 'Request error, something went wrong...(('

    const fetchGroups = () => {
        axiosInstance.get('api/music-bands', {
        })
            .then((response) => {
                const rowData: RowData[] = response.data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    coordinates: item.coordinates as Coordinates,
                    creationDate: new Date(item.creationDate), // преобразование строки в объект Date
                    genre: item.genre as Genre,
                    numberOfParticipants: item.numberOfParticipants,
                    singlesCount: item.singlesCount,
                    description: item.description,
                    bestAlbum: item.bestAlbum as BestAlbum,
                    albumsCount: item.albumsCount, // Приведение к типу Semester
                    establishmentDate: new Date(item.establishmentDate),
                    studio: item.studio as Studio,
                    createdBy: item.createdBy,
                }));

                setBands(rowData)
            })
    }

    useEffect(() => {
        fetchGroups()
    }, []);

    const handleSpecialButtonClick = (index: number) => {
        setOpenIndex(index)
    }


    const handleSpecialActionButtonClick = (actionIndex: number) => {
        switch (actionIndex) {
            case 0:
                axiosInstance.get(`api/special/count-by-studio`, {params: {
                    studioId: intModalValue
                    }})
                    .then((response) => {
                        if (response.status === 200) {
                            setSuccessRequest(true)
                            setResponseText(`Number of bands with studio id ${intModalValue} is ${response.data}`)
                            setIsInformationalMessage(true)
                        }
                    })
                    .catch(() => {
                        setRequestError(true)
                        setResponseText(defaultResponseErrorMessage)
                    })
                setOpenIndex(-1)
                setIntModalValue('')
                setValidationError(true)
                break
            case 2:
                axiosInstance.get(`api/special/albums-count-greater`, {params: {
                        albumsCount: intModalValue
                    }})
                    .then((response) => {
                        if (response.status === 200) {
                            const matchesArray = response.data.length !== 0
                                ? response.data
                                    .map((item: { id: any; name: any; }) => `ID: ${item.id}. Name: ${item.name} <br>`)
                                    .join('')
                                : 'No matches'
                            setSuccessRequest(true)
                            setResponseText(matchesArray)
                            setIsInformationalMessage(true)
                        }
                    })
                    .catch(() => {
                        setRequestError(true)
                        setResponseText(defaultResponseErrorMessage)
                    })
                setOpenIndex(-1)
                setIntModalValue('')
                setValidationError(true)
                break

            case 3:
                axiosInstance.put(`api/special/add-single`, null, {params: {
                    id: selectedBandId,
                }})
                    .then((response) => {
                        if (response.status === 200) {
                            setSuccessRequest(true)
                            setResponseText('Single has been successfully added!')
                            setIsInformationalMessage(false)
                        }
                    })
                    .catch(() => {
                        setRequestError(true)
                        setResponseText(defaultResponseErrorMessage)
                    })
                setSelectedBandId(undefined)
                setOpenIndex(-1)
                break

            case 4:
                axiosInstance.post(`api/special/nominate`, null, {params: {
                        id: selectedBandId
                    }
                })
                    .then((response) => {
                        if (response.status === 200) {
                            setSuccessRequest(true)
                            setResponseText('Band has been successfully nominated!')
                            setIsInformationalMessage(false)
                        }
                    })
                    .catch(() => {
                        setRequestError(true)
                        setResponseText(defaultResponseErrorMessage)
                    })
                setOpenIndex(-1)
                setSelectedBandId(undefined)
                break


            // case 5: // Min description
            //     axiosInstance.get(`/api/special/min-description`)
            //         .then((response) => {
            //             if (response.status === 200) {
            //                 const band = response.data;
            //                 const displayText = `ID: ${band.id} | Name: ${band.name} | Description: ${band.description}`;
            //                 setResponseText(displayText);
            //                 setSuccessRequest(true);
            //                 setIsInformationalMessage(true);
            //             }
            //         })
            //         .catch(() => {
            //             setResponseText(defaultResponseErrorMessage);
            //             setRequestError(true);
            //         });
            //     break;
            default:
                setOpenIndex(0)
        }
    }

    const handleNotificationCLose = () => {
        setSuccessRequest(false)
        setRequestError(false)
    }

    // const getMaxEstablishmentDate = () => {
    //     axiosInstance.get(`api/special/max-establishment-date`)
    //         .then((response) => {
    //             if (response.status === 200) {
    //                 setSuccessRequest(true)
    //                 setResponseText(`Found object: id = ${response.data.id}, name = ${response.data.name}`)
    //                 setIsInformationalMessage(true)
    //             }
    //         })
    //         .catch(() => {
    //             setRequestError(true)
    //             setResponseText(defaultResponseErrorMessage)
    //         })
    // }

    const handleBandSelection = (event: SelectChangeEvent) => {
        setSelectedBandId(Number(event.target.value));
    };


    const validateIntModalValue = (value: string) => {
        if (parseInt(value) < 0 || !Number.isInteger(+value) || value.length === 0) {
            setValidationError(true);
            setHelperText('Value must be a positive integer!');
        } else {
            setValidationError(false);
            setHelperText('');
        }
    };

    // Обработка изменения значения в поле
    const handleIntModalValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setIntModalValue(inputValue);
        validateIntModalValue(inputValue); // Валидируем при каждом изменении
    };

    const handleFetchMinDescription = async () => {
        try {
            const response = await axiosInstance.get(`/api/special/min-description`);
            if (response.status === 200 && response.data) {
                const band = response.data;
                const displayText = `ID: ${band.id} | Name: ${band.name} | Description: ${band.description}`;
                setResponseText(displayText);
                setSuccessRequest(true);
                setIsInformationalMessage(true);
            } else {
                setResponseText('No band found');
                setSuccessRequest(true);
                setIsInformationalMessage(true);
            }
        } catch (err) {
            console.error("Error calling min-description API:", err);
            setResponseText(defaultResponseErrorMessage);
            setRequestError(true);
        }
    };

    const handleCountStudioGreater = (studioId: number) => {
        axiosInstance.get(`/api/special/count-studio-greater`, { params: { studioId } })
            .then(response => {
                if (response.status === 200) {
                    setResponseText(`Number of bands with studioId > ${studioId}: ${response.data}`);
                    setSuccessRequest(true);
                    setIsInformationalMessage(true);
                }
            })
            .catch(err => {
                console.error("Error calling count-studio-greater API:", err);
                setResponseText(defaultResponseErrorMessage);
                setRequestError(true);
            });
    };


    const handleAwardBest = () => {
        if (!selectedAwardBandId || !selectedGenre) {
            setResponseText('Please select both a band and a genre');
            setSuccessRequest(true);
            setIsInformationalMessage(true);
            return;
        }

        axiosInstance.post(`/api/special/award-best`, null, {
            params: {
                bandId: selectedAwardBandId,
                genre: selectedGenre
            }
        })
            .then((response) => {
                if (response.status === 200 && response.data) {
                    const data = response.data;
                    setResponseText(`Awarded band ID ${data.id} as best in genre ${data.genre} at ${data.nominationTime}`);
                    setSuccessRequest(true);
                    setIsInformationalMessage(false);

                    // Chỉ reset khi thành công
                    setOpenAwardDialog(false);
                    setSelectedAwardBandId(undefined);
                    setSelectedGenre(undefined);
                }
            })
            .catch((err) => {
                console.error('Award Best API error:', err);

                // Hiển thị thông báo lỗi từ server nếu có
                const msg = err.response?.data?.message || defaultResponseErrorMessage;
                setResponseText(`Error: ${msg}`);
                setRequestError(true);

                // Không reset các state nếu có lỗi
                setOpenAwardDialog(true);
            });
    };





    const buttons = [
        <Button key="0" onClick={() => handleSpecialButtonClick(0)}><LibraryMusicIcon sx={{marginRight: 1}}/> Count by studio </Button>,
        // <Button key="1" onClick={getMaxEstablishmentDate}> <DateRangeIcon sx={{marginRight: 1}}/> Find with max establishment date</Button>,
        <Button key="2" onClick={() => handleSpecialButtonClick(2)}> <AlbumIcon sx={{marginRight: 1}}/>Albums count greater </Button>,
        <Button key="3" onClick={() => handleSpecialButtonClick(3)}><AddCircleOutlineIcon sx={{marginRight: 1}}/>Add single</Button>,
        <Button key="4" onClick={() => handleSpecialButtonClick(4)}><EmojiEventsIcon sx={{marginRight: 1}}/>Nominate band for a prize</Button>,
        <Button key="5" onClick={handleFetchMinDescription}>
            <SearchIcon sx={{marginRight: 1}} /> Band with Min Description
        </Button>,
        <Button
            key="6"
            onClick={() => setOpenIndex(6)}
        >
            <AccountBalanceIcon sx={{marginRight: 1}} /> Count Studio Greater
        </Button>,
        <Button
            key="7"
            onClick={() => setOpenIndex(6)}
        >
            <FilterAltIcon sx={{marginRight: 1}} /> Bands with Studio ID &gt; ?
        </Button>,
        <Button
            key="8"
            onClick={() => setOpenAwardDialog(true)}
        >
            <EmojiEventsIcon sx={{marginRight: 1}} />
            Award Best Band
        </Button>





    ];

    return (
                <Box sx={{flexGrow: 1, minWidth: '100vw'}}>
                    <CustomAppBar/>

                    <ThemeProvider theme={darkTheme}>

                        <CollectionObjectsDataGrid/>

                <ButtonGroup size="large" aria-label="Large button group" sx={{marginTop: 6, width: '90%'}}>
                    {buttons}
                </ButtonGroup>


                    <Notification
                        onNotificationClose={handleNotificationCLose}
                        openCondition={successRequest}
                        responseText={responseText}
                        severity={isInformationalMessage ? 'info' : 'success'}
                    />

                        <Dialog open={openIndex === 0} onClose={() => setOpenIndex(-1)}>
                            <DialogTitle>Count bands with studio value = </DialogTitle>
                            <DialogContent>
                                <TextField
                                    required
                                    label="Studio id value"
                                    type="number"
                                    value={intModalValue}
                                    onChange={handleIntModalValueChange}
                                    error={validationError}
                                    helperText={helperText}
                                    sx={{marginTop: 2, width: '100%'}}
                                ></TextField>
                            </DialogContent>

                            <DialogActions>
                                <Button
                                    disabled={validationError}
                                    onClick={() => handleSpecialActionButtonClick(0)}
                                >
                                    Count
                                </Button>
                            </DialogActions>

                        </Dialog>

                        <Dialog open={openIndex === 2} onClose={() => {setOpenIndex(-1)}}>
                            <DialogTitle>Count bands with number of albums &gt; </DialogTitle>
                            <DialogContent>
                                <TextField
                                    required
                                    label="Albums count"
                                    type="number"
                                    value={intModalValue}
                                    onChange={handleIntModalValueChange}
                                    error={validationError}
                                    helperText={helperText}
                                    sx={{marginTop: 2, width: '100%'}}
                                ></TextField>
                            </DialogContent>

                            <DialogActions>
                                <Button
                                    disabled={validationError}
                                    onClick={() => handleSpecialActionButtonClick(2)}
                                >
                                    Search
                                </Button>
                            </DialogActions>

                        </Dialog>

                        <Dialog open={openIndex === 3} onClose={() => setOpenIndex(-1)}>
                            <DialogTitle>Add single to a selected band</DialogTitle>
                            <DialogContent>
                                <InputLabel>Band</InputLabel>
                                <Select
                                    sx={{width: '100%'}}
                                    defaultValue={undefined}
                                    label="Band"
                                    variant="standard"
                                    required
                                    onChange={handleBandSelection}
                                >
                                    {Object.values(bands).map((band, index) => (
                                        <MenuItem value={band.id} key={index}>
                                            {band.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </DialogContent>

                            <DialogActions>
                                <Button
                                    disabled={!selectedBandId}
                                    onClick={() => handleSpecialActionButtonClick(3)}
                                >
                                    Add single
                                </Button>
                            </DialogActions>

                        </Dialog>

                        <Dialog open={openIndex === 4} onClose={() => setOpenIndex(-1)}>
                            <DialogTitle>Nominate selected band for a prize</DialogTitle>
                            <DialogContent>
                                <InputLabel>Band</InputLabel>
                                <Select
                                    sx={{width: '100%'}}
                                    defaultValue={undefined}
                                    label="Band"
                                    variant="standard"
                                    required
                                    onChange={handleBandSelection}
                                >
                                    {Object.values(bands).map((band, index) => (
                                        <MenuItem value={band.id} key={index}>
                                            {band.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </DialogContent>

                            <DialogActions>
                                <Button
                                    disabled={!selectedBandId}
                                    onClick={() => handleSpecialActionButtonClick(4)}
                                >
                                   Nominate
                                </Button>
                            </DialogActions>

                        </Dialog>

                        <Dialog open={openIndex === 6} onClose={() => setOpenIndex(-1)}>
                            <DialogTitle>Count bands with studio ID greater than:</DialogTitle>
                            <DialogContent>
                                <TextField
                                    required
                                    label="Studio ID"
                                    type="number"
                                    value={intModalValue}
                                    onChange={handleIntModalValueChange}
                                    error={validationError}
                                    helperText={helperText}
                                    sx={{ marginTop: 2, width: '100%' }}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    disabled={validationError}
                                    onClick={() => {
                                        handleCountStudioGreater(Number(intModalValue));
                                        setOpenIndex(-1);
                                        setIntModalValue('');
                                        setValidationError(true);
                                    }}
                                >
                                    Search
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog open={openIndex === 7} onClose={() => setOpenIndex(-1)}>
                            <DialogTitle>Bands with Studio ID greater than:</DialogTitle>
                            <DialogContent>
                                <TextField
                                    required
                                    label="Studio ID"
                                    type="number"
                                    value={intModalValue}
                                    onChange={(e) => setIntModalValue(e.target.value)}
                                    sx={{marginTop: 2, width: '100%'}}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    disabled={!intModalValue}
                                    onClick={() => {
                                        axiosInstance.get(`/api/special/studio-greater`, { params: { studioId: intModalValue } })
                                            .then((response) => {
                                                if (response.status === 200 && response.data.length > 0) {
                                                    const bandsList = response.data
                                                        .map((band: any) => `ID: ${band.id} | Name: ${band.name} | Studio ID: ${band.studio?.id ?? 'N/A'}`)
                                                        .join('<br>');
                                                    setResponseText(bandsList);
                                                    setSuccessRequest(true);
                                                    setIsInformationalMessage(true);
                                                } else {
                                                    setResponseText('No bands found');
                                                    setSuccessRequest(true);
                                                    setIsInformationalMessage(true);
                                                }
                                            })
                                            .catch(() => {
                                                setResponseText(defaultResponseErrorMessage);
                                                setRequestError(true);
                                            });
                                        setOpenIndex(-1);
                                        setIntModalValue('');
                                    }}
                                >
                                    Search
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog open={openAwardDialog} onClose={() => setOpenAwardDialog(false)}>
                            <DialogTitle>Award Band as Best in Genre</DialogTitle>
                            <DialogContent>
                                <InputLabel>Band</InputLabel>
                                <Select
                                    sx={{width: '100%'}}
                                    value={selectedAwardBandId}
                                    onChange={(e) => setSelectedAwardBandId(Number(e.target.value))}
                                    variant="standard"
                                    required
                                >
                                    {bands.map((band) => (
                                        <MenuItem value={band.id} key={band.id}>
                                            {band.name}
                                        </MenuItem>
                                    ))}
                                </Select>

                                <InputLabel sx={{marginTop: 2}}>Genre</InputLabel>
                                <Select
                                    sx={{width: '100%'}}
                                    value={selectedGenre}
                                    onChange={(e) => setSelectedGenre(e.target.value as Genre)}
                                    variant="standard"
                                    required
                                >
                                    {Object.values(Genre).map((g) => (
                                        <MenuItem value={g} key={g}>{g}</MenuItem>
                                    ))}
                                </Select>
                            </DialogContent>

                            <DialogActions>
                                <Button
                                    disabled={!selectedAwardBandId || !selectedGenre}
                                    onClick={handleAwardBest}
                                >
                                    Award
                                </Button>
                            </DialogActions>
                        </Dialog>


                        <Notification
                            onNotificationClose={handleNotificationCLose}
                            openCondition={requestError}
                            responseText={responseText}
                            severity="error"
                        />
                </ThemeProvider>


</Box>


    );
}

export default MainScreen