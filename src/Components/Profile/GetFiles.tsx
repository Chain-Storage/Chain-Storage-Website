import React, { ComponentLifecycle } from "react";
import SendFile from "../../artifacts/contracts/SendFile.sol/SendFile.json";
import BuyGb from "../../artifacts/contracts/BuyGb.sol/BuyGb.json";
import { ethers } from "ethers";
import { Table, Card, Button, Row, Spinner} from "react-bootstrap";
import { Web3Storage, File } from "web3.storage";
import { Link } from "react-router-dom";
import { SendFiles } from "./SendFile";
import {
  MdOutlineContentCopy,
  MdOutlineDeleteOutline,
  MdOutlineImage,
  MdOutlineCode,
  MdPictureAsPdf,
  MdVideocam,
  MdMusicVideo,
  MdCode,
  MdOutlineFilePresent
} from "react-icons/md";
import { trackPromise } from "react-promise-tracker";
// import { Link } from "react-router-dom";

declare let window: any;

interface State {
  _FileName: string;
  _FileLink: string;
  _FileSize: string | number;
  UserFiles: any[];
  LastUploads: any[];
  CurrenRole: any[] | any;
  myFile: any;
  totalStorage: any;
  totalFileSize: any;
  loading: any;
}

interface Component<P = {}, S = {}> extends ComponentLifecycle<P, S> {}

const sizeArray: any[] = [];

export class GetFiles extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);

    this.fileChangedHandler = this.fileChangedHandler.bind(this);
    this.DeleteFiles = this.DeleteFiles.bind(this);
    this.GetUserRole = this.GetUserRole.bind(this);
    this.ShareingFiles = this.ShareingFiles.bind(this);
    this.main = this.main.bind(this);

    this.state = {
      _FileName: "",
      _FileLink: "",
      _FileSize: "",
      UserFiles: [],
      LastUploads: [],
      CurrenRole: [],
      myFile: null,
      totalStorage: "",
      totalFileSize: "",
      loading: false,
    };
  }

  public fileChangedHandler(e: any) {
    this.setState({ myFile: e.target.files[0] });
  }

  async GetUserRole() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        "0x22b5554D99B7bc53483e8E13263F1EB45089a7e5",
        BuyGb.abi,
        provider
      );
      try {
        let noting;
        const data = await contract.currentRole();
        console.log(data)
        let dataArray: any[] = [];

        for (let index = 0; index < data.length; index++) {
          const element = data[index];

          if (
            element.userAddress.toLowerCase() ===
            window.ethereum.selectedAddress 
          ) {
            console.log("File Added");
            dataArray.push(element);
          }
        }
        const arr = dataArray.slice(-1).pop()

        this.state.CurrenRole.role = "standart";
        this.setState({ CurrenRole: arr });
       const userRole = this.state.CurrenRole;
        console.log(this.state.CurrenRole);
      } catch (error: unknown) {
        console.error(error);
      }
    }
  }

  async main() {
    if(typeof window.ethereum !== "undefined") {
      this.GetUserRole()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        "0xd8EB6F8C4882Af90FEC4EBA485df8d66Be0DE970" ||
          `${process.env.CREATE_FILE_KEY}`,
        SendFile.abi,
        provider
      );
      console.log(contract);
     try {
        const data = await contract.getFiles();
        const dataArray: any[] = [];
        for (let index = 0; index < data.length; index++) {
          const element = data[index];

          if (
            element.userAddress.toLowerCase() ===
            window.ethereum.selectedAddress
          ) {
            const setFileFormats = (fileType: string) => {
               const varName = element.fileName.endsWith(fileType);
               return varName;
            }

            let fileImage;
            if(setFileFormats("png" || "svg" || "jpeg" || "jpg" || "tiff" || "tif") === true) {
              fileImage = <MdOutlineImage />
            } else if(setFileFormats("pdf") === true) {
              fileImage = <MdPictureAsPdf />
            } else if(setFileFormats("mp.4") === true) {
              fileImage = <MdVideocam /> 
            } else if(setFileFormats("mp.3" || "waw") === true) {
              fileImage = <MdMusicVideo />
            } else if(setFileFormats("html" || "ts" || "js" || "py" || "c" || "java" || "grapql" || "tsx" || "sol" || "jsx" || "json") === true) {
              fileImage = <MdOutlineCode />
            } else {
              fileImage = <MdOutlineFilePresent />
            }
            const fileImageArray = [fileImage]
            const contactElement = fileImageArray.concat(element)
            console.log(fileImage)
            dataArray.push(contactElement);
          }
        }


        dataArray.reverse();
        this.setState({ UserFiles: dataArray });
        const lastFourUploads = this.state.UserFiles.slice(0, 4);
        const sliceUploads = lastFourUploads;
        //this.setState({ totalStorage: dataArray });
        this.setState({ LastUploads: sliceUploads })
        console.log(this.state.UserFiles);
        console.log(this.state.LastUploads);

        this.state.UserFiles.forEach((element) => {
          console.log(element.fileSize);
          const sizeNumber = Number(element[2]);
          sizeArray.push(sizeNumber);
        });

        console.log(sizeArray);

        const calc = (a: any) => {
          var total = 0;
          for (var i in a) {
            total += a[i];
          }
          return total;
        };

        const totalFileSize: any = calc(sizeArray);

        const sliceSize = totalFileSize.toString()
        const slie = sliceSize.slice(0, 5)

        this.setState({ totalFileSize: slie });
       
        console.log(this.state.totalFileSize);
        this.setState({ loading: true })
      } catch (err: unknown) {
        console.log("Error: ", err);
      }
    }
  }

  async componentDidMount() {
      this.main();
  } 

  async DeleteFiles(fileCount: any) {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.CREATE_FILE_KEY ||
          "0xd8EB6F8C4882Af90FEC4EBA485df8d66Be0DE970",
        SendFile.abi,
        signer
      );
      console.log(contract);
      const data = await contract.deleteFile(
        window.ethereum.selectedAddress,
        fileCount
      )
      console.log(data)
    }
  }

  async ShareingFiles() {

  }

  async UpgradeLink() {
    if(this.state.CurrenRole.role === "preminum") {
      return <Link to="/profile/buyStorage"> Upgrade Account</Link>;
    } else {
      return <Link to="/profile/buyStorage"> Upgrade Account</Link>;
    }
      return <Link to="/profile/buyStorage"> Upgrade Account</Link>;
  }

  render(): React.ReactNode {
    let LastFileCheck;
    let UserRole;
    let UserMaxGb;
    if(this.state.LastUploads.length === 0) {
      LastFileCheck = "";
    } else {
      LastFileCheck = "Last Upload"
    }
    if(typeof this.state.CurrenRole === "undefined") {
      UserRole = "standart";
      UserMaxGb = "5000";
    } else if(this.state.CurrenRole[1] === "gold") {
      UserRole = "gold";
      UserMaxGb = "50000";
    } else if(this.state.CurrenRole[1] === "preminum") {
      UserRole = "preminum";
      UserMaxGb = "1000000";
    } 
   return (
      <>
        <div>
        <div className="row w-100" style={{margin: '0 auto'}}> 
        <div className="col-md-3">
            <h5>{this.state.totalFileSize} / {UserMaxGb} Mb</h5>
            <h1>Role: {UserRole}</h1>
            <h1> {this.UpgradeLink} </h1>
            <Link to="/profile/buyStorage"> Upgrade Account</Link>
            <SendFiles />
        </div>
        <div className="col-md-9">
            <Row> 
            <h2>{LastFileCheck}</h2>
          {this.state.LastUploads.map((data: any) => (
            <div className="col-md-3 mb-4"> 
            <Card style={{ width: '10rem', height: "10rem" }}>
                <div style={{width: '10rem', margin: "0 auto"}}> 
                  {data[0]}
                </div>
              <Card.Body>
                <Card.Title>{data[4].slice(0, 20)}</Card.Title>
                  <Card.Text>
                      {data[2]} Mb
                  </Card.Text>
             </Card.Body>
           </Card>
           </div>
          ))}

           </Row>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th></th>
                <th>FileSize</th>
              </tr>
            </thead>
            {this.state.UserFiles.map((data: any) => (
              <tbody>
                <tr>
                  <td>{data[0]}</td>
                  <td>{data[4].slice(0, 20)}</td>
                  <td>{data[2]}</td>
                  <td><MdOutlineContentCopy onClick={() => {navigator.clipboard.writeText(data[5])}}/> </td>
                  <td><MdOutlineDeleteOutline  onClick={() => this.DeleteFiles(Number(data[3]._hex.slice(-1)))}/> </td>
                </tr>
              </tbody>
            ))}
          </Table>
        </div>
        </div>
        </div>
        {this.state.loading ? (this.main) : (
            <div style={{  width: "50px",
  height: "50px",
  position: "absolute",
  top: "50%",
  left: "50%",
  margin: "-25px 0 0 -25px", }} >
    
<Spinner animation="border" role="status">
  <span className="visually-hidden">Loading...</span>
</Spinner>

  </div>
        )}
      </>
    );
  }
}
