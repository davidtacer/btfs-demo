import React, { useState } from 'react'
import { Button, TextField } from '@mui/material'
import axios from 'axios'
import Dropzone from '../themes/ui/drop-zone'
import FileSaver from 'file-saver'

const btfsUrl = 'https://api.datavallis.com'
const headers = {
    'API-KEY': 'rv1224zXtmcdKDCGeGpanfcKKKsrhwkxJeuBtMeA',
    'Content-Type': 'application/json'
}
const nodeInfo = {
    "ID": "16Uiu2HAkyi2S3RMJSubGKro2x9rZc3XjTue6iBt8FEJGTsasC1EJ",
    "PublicKey": "CAISIQI/nyqcGsLGlFqqtmlj7Oa+gErr/kHx5CZ63Spg5Xyf+w==",
    "Addresses": [
        "/ip4/10.88.0.10/tcp/4001/p2p/16Uiu2HAkyi2S3RMJSubGKro2x9rZc3XjTue6iBt8FEJGTsasC1EJ",
        "/ip4/127.0.0.1/tcp/4001/p2p/16Uiu2HAkyi2S3RMJSubGKro2x9rZc3XjTue6iBt8FEJGTsasC1EJ",
        "/ip4/5.75.128.112/tcp/4001/p2p/16Uiu2HAkyi2S3RMJSubGKro2x9rZc3XjTue6iBt8FEJGTsasC1EJ",
        "/ip4/5.75.128.112/tcp/60874/p2p/16Uiu2HAkyi2S3RMJSubGKro2x9rZc3XjTue6iBt8FEJGTsasC1EJ",
        "/ip6/::1/tcp/4001/p2p/16Uiu2HAkyi2S3RMJSubGKro2x9rZc3XjTue6iBt8FEJGTsasC1EJ"
    ],
    "AgentVersion": "go-btfs/2.2.1/",
    "ProtocolVersion": "btfs/0.1.0",
    "Protocols": [
        "/btfs/kad/1.0.0",
        "/btfs/lan/kad/1.0.0",
        "/ipfs/bitswap",
        "/ipfs/bitswap/1.0.0",
        "/ipfs/bitswap/1.1.0",
        "/ipfs/bitswap/1.2.0",
        "/ipfs/id/1.0.0",
        "/ipfs/id/push/1.0.0",
        "/ipfs/ping/1.0.0",
        "/libp2p/autonat/1.0.0",
        "/libp2p/circuit/relay/0.1.0",
        "/p2p/id/delta/1.0.0",
        "/x/"
    ],
    "DaemonProcessID": 1,
    "TronAddress": "TPnoyHPkvSRtbMZkfgD7WNzCY2qh1SfGK7",
    "BttcAddress": "0x979a60599d2B8878fB7763cEB8b54EB76ca8554f",
    "VaultAddress": "0x2A2607B0405c435B6B4C52788eC32060CF600963",
    "ChainID": 1029
}

interface IBTFSData {
    first_name: string
    last_name: string
    token: string
    account_type_id: number
}

interface IUploadedFile {
    name: string
    preview: string
    isDefault?: boolean
}

interface INodeInfo {
    data: string
}

const BTFSDemo = () => {
    const [email, setEmail] = useState<string>('demo@btfs.io')
    const [password, setPassword] = useState<string>('demo3demo3demo3')
    const [btfsData, setBtfsData] = useState<IBTFSData>(null)
    const [files, setFiles] = useState<any[]>([])
    const [uploadedFiles, setUploadedFiles] = useState<IUploadedFile[]>([])
    const [nodeInfo, setNodeInfo] = useState<INodeInfo>(null)

    const handleLogin = async () => {
        console.log(email, password)

        const response = (
            await axios.post(
                `${btfsUrl}/v1/auth/login`,
                {
                    email,
                    password
                },
                {
                    headers
                }
            )
        ).data

        if (response.status) {
            setBtfsData(response.data)
        }
    }

    const handleUpload = async () => {
        console.log(files[0])
        const formData = new FormData()
        formData.append('file', files[0])

        const response = (
            await axios.post(`${btfsUrl}/v1/storage/btfs`, formData, {
                headers: { token: btfsData.token, 'Content-Type': 'multipart/form-data' }
            })
        ).data

        setUploadedFiles([
            {
                name: files[0].name,
                hash: files[0].hash,
                Size: files[0].size,
                preview: response.data.PublicUrl
            }
        ])
    }

    const handleNodeInfo = async () => {
        console.log(files[0])
        const response = (
            await axios.get(`${btfsUrl}/v1/storage/btfs-info`,{
                headers: { token: btfsData.token, 'Content-Type': 'multipart/form-data' }
            })
        ).data

        setNodeInfo(response.data)
    }

    const handleDownload = async () => {
        axios.get(uploadedFiles[0].preview, { responseType: 'blob' }).then(response => {
            FileSaver.saveAs(response.data, uploadedFiles[0].name)
        })
    }

    return (
        <div style={{padding:"20px"}}>
            <h2>PuzzleX BTFS Demo</h2>
            {!btfsData ? (
                <div>
                    <p>Login to BTFS</p>
                    <form>
                        <TextField required label='Email' id='email' variant='standard' value={email} onChange={event => setEmail(event.target.value)} className='mr-2' />
                        <TextField
                            required
                            label='Password'
                            id='password'
                            variant='standard'
                            value={password}
                            onChange={event => setPassword(event.target.value)}
                            className='mr-2'
                        />
                        <Button onClick={handleLogin} variant='contained' color='success'>
                            Login
                        </Button>
                    </form>
                </div>
            ) : (
                <div>
                    <p>
                        Welcome,
                        <span className='font-weight-bold ml-1'>
              {btfsData.first_name} {btfsData.last_name}
            </span>
                    </p>
                    <div style={{width: "300px", lineBreak: "anywhere"}}><b>Your JTW auth token:</b><br/> {btfsData.token}</div>

                    {nodeInfo ? (
                        <div>
                            <br/><br/><h3>Node Info</h3>
                            <h4>
                                <u>
                                    <a target="_blank" href={`${nodeInfo.scanUrl}`}>Check BTFS scan</a>
                                </u>
                            </h4>
                            <pre>
           {JSON.stringify(nodeInfo, null, 2) }


          </pre>
                        </div>
                    ) : (
                        <div className='row ml-0 mt-4'>
                            <Button onClick={handleNodeInfo} variant='contained' color='success'>
                                Node Info
                            </Button>
                        </div>
                    )}
                    <div className='row ml-0 mt-4'>
                        <h3>Upload file</h3>
                    </div>
                    <div className='row ml-0'>
                        <Dropzone uploadedFiles={files} onDropFiles={setFiles} onChangeFiles={setFiles} />
                    </div>
                    <div className='row ml-0 mt-4'>
                        <Button onClick={handleUpload} variant='contained' color='success'>
                            Upload
                        </Button>
                    </div>

                    {!!uploadedFiles.length && (
                        <div>
                            <div className='row ml-0 mt-4'>
                                <h3>Uploaded file on BTFS</h3>
                                {JSON.stringify(uploadedFiles[0], null, 2) }
                                <h4>
                                    <br/>
                                    <br/>
                                    <u>
                                        <a target="_blank" href={`${uploadedFiles[0].preview}`}>Check BTFS public gateway</a>
                                    </u>
                                </h4>
                            </div>
                            <div className='row ml-0'>
                                <Dropzone uploadedFiles={uploadedFiles} hideUpload={true} />
                            </div>
                            <div className='row ml-0 mt-4'>
                                <Button onClick={handleDownload} variant='contained' color='success'>
                                    Download
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>
    )
}

export default BTFSDemo
