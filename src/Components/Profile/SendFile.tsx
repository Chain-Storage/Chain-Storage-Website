import React, { ComponentLifecycle } from "react";
import SendFile from "../../artifacts/contracts/SendFile.sol/SendFile.json";
import BuyGb from "../../artifacts/contracts/BuyGb.sol/BuyGb.json";
import { ethers } from "ethers";
import { Web3Storage, File } from "web3.storage";
import { Button } from "react-bootstrap";
import { MdOutlineImage, MdOutlineCode, MdPictureAsPdf, MdVideocam, MdMusicVideo, MdCode, MdOutlineFilePresent } from "react-icons/md";
// import { Link } from "react-router-dom";

declare let window: any;

interface State {
  _FileName: string;
  _FileLink: string;
  _FileSize: string | number;
  UserFiles: any[];
  CurrenRole: any[] | any;
  LastUploads: any[] | any,
  myFile: any;
  totalStorage: any;
  totalFileSize: any;
}

interface Component<P = {}, S = {}> extends ComponentLifecycle<P, S> {}

const sizeArray: any[] = [];

export class SendFiles extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);

    this.createFiles = this.createFiles.bind(this);
    this.fileChangedHandler = this.fileChangedHandler.bind(this);
    this.GetUserRole = this.GetUserRole.bind(this);
    this.main = this.main.bind(this);
    
    this.state = {
      _FileName: "",
      _FileLink: "",
      _FileSize: "",
      UserFiles: [],
      CurrenRole: [],
      LastUploads: [],
      myFile: null,
      totalStorage: "",
      totalFileSize: "",
    };
  }

  public fileChangedHandler(e: any) {
    this.setState({ myFile: e.target.files[0] });
  }

  async main() {
    console.log(process.env);
    this.GetUserRole();
    if (typeof window.ethereum !== "undefined") {
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
        this.setState({ LastUploads: sliceUploads });
        //this.setState({ totalStorage: dataArray });
        console.log(this.state.UserFiles);
        console.log(this.state);

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
      } catch (err: unknown) {
        console.log("Error: ", err);
      }
    }
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

        this.setState({ CurrenRole: arr });
        const userRole = this.state.CurrenRole;
        console.log(this.state.CurrenRole);
      } catch (error: unknown) {
        console.error(error);
      }
    }
  }

  async createFiles(e: any) {
    e.preventDefault();
    if (typeof window.ethereum !== "undefined") {
      this.main();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0xd8EB6F8C4882Af90FEC4EBA485df8d66Be0DE970" ||
          `${process.env.CREATE_FILE_KEY}`,
        SendFile.abi,
        signer
      );
      console.log(contract);

      const calc = (a: any) => {
        var total = 0;
        for (var i in a) {
          total += a[i];
        }
        return total;
      };

      const totalFileSize = calc(sizeArray);
      console.log(totalFileSize);


      const GbProvider = new ethers.providers.Web3Provider(window.ethereum);
      const GbContract = new ethers.Contract(
        "0x22b5554D99B7bc53483e8E13263F1EB45089a7e5",
        BuyGb.abi,
        GbProvider
      );
        const GbData = await GbContract.currentRole();
        console.log(GbData)
        let dataArray: any[] = [];

        for (let index = 0; index < GbData.length; index++) {
          const element = GbData[index];
          if (
            element.userAddress.toLowerCase() ===
            window.ethereum.selectedAddress 
          ) {
            console.log("File Added");
            dataArray.push(element);
          }
        }
        const arr = dataArray.slice(-1).pop()
        this.setState({ CurrenRole: arr });
        const userRole = this.state.CurrenRole;
        console.log(this.state.CurrenRole);
        console.log(this.state.totalFileSize);
     let UserRole;   
     if(typeof this.state.CurrenRole === "undefined") {
        UserRole = "standart";
     } else {
       UserRole = this.state.CurrenRole.role;
     }  

    if(UserRole === "standart" && this.state.totalFileSize > 5000) {
      alert('not engouh space')
      throw new Error("wrond wondwonsda");
    } else if(UserRole === "gold" && this.state.totalFileSize > 50000) {
      alert('not engouh space')
      throw new Error("wrond wondwonsda");
    } else if(UserRole === "preminum" && this.state.totalFileSize > 1000000) {
      alert('not engouh space')
      throw new Error("wrond wondwonsda");
    } 

      if (totalFileSize >= 2) {
        console.log("over storage");
      } else {
        console.log("normall pass");
      }
      try {
        const token: string | any =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDlCOTMzOTU5NjMxMTkwMjdBODFkZUUwOTlhODQxNEIxMDA3YzkxZTkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDM4NzY2NTY0NTgsIm5hbWUiOiJhcGkifQ.Wt_lXKV_LBhiwJqLrc-9iqKNMrtilPB8dVnrgS9ZPd4" ||
          process.env.WEB3_STORAGE ||
          "";
        const client = new Web3Storage({ token });

        const files = [new File([this.state.myFile], this.state.myFile.name)];
        console.log(files);

        const cid = await client.put(files);
        console.log(cid);

        const Sendres: any = await client.get(cid);
        const filesInfo = await Sendres.files();
        console.log(filesInfo);

        for (const file of filesInfo) {
          const fileSize = file.size / 1000000;
          console.log(file);
          console.log(fileSize);

          this.setState({ _FileName: file.name });

          this.setState({
            _FileLink: `https://${cid}.ipfs.dweb.link/${file.name}`,
          });

          this.setState({ _FileSize: `${fileSize}` });
        }
        console.log(
          this.state._FileName,
          this.state._FileLink,
          this.state._FileSize
        );
        const data = await contract.createFiles(
          this.state._FileName,
          this.state._FileLink,
          this.state._FileSize
        );
        await data.wait();
        console.log("data: ", data);
        console.log(window.ethereum.selectedAddress);
      } catch (err: unknown) {
        console.log("Error: ", err);
      }
    }

    this.setState({ _FileName: "", _FileLink: "", _FileSize: "" });
  }

  render() {
    return (
      <div>
        <h1>Profile</h1>
        <form onSubmit={this.createFiles}>
          <div className="form-group">
            <label>Files</label>
            <input
              type="file"
              onChange={(e) => this.fileChangedHandler(e)}
              className="form-control mb-4"
            />
          </div>
          <div className="form-group">
          <Button variant="secondary" type="submit">Send File</Button>
          </div>
        </form>
      </div>
    );
  }
}
