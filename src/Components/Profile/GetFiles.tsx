import React, { ComponentLifecycle } from "react";
import SendFile from "../../artifacts/contracts/SendFile.sol/SendFile.json";
import { ethers } from "ethers";
import { Web3Storage, File } from "web3.storage";
// import { Link } from "react-router-dom";

declare let window: any;

interface State {
  _FileName: string;
  _FileLink: string;
  _FileSize: string | number;
  UserFiles: any[];
  myFile: any;
  totalStorage: any;
  totalFileSize: any;
}

interface Component<P = {}, S = {}> extends ComponentLifecycle<P, S> {}

const sizeArray: any[] = [];

export class GetFiles extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);

    this.createFiles = this.createFiles.bind(this);
    this.fileChangedHandler = this.fileChangedHandler.bind(this);

    this.state = {
      _FileName: "",
      _FileLink: "",
      _FileSize: "",
      UserFiles: [],
      myFile: null,
      totalStorage: "",
      totalFileSize: "",
    };
  }

  public fileChangedHandler(e: any) {
    this.setState({ myFile: e.target.files[0] });
  }

  async componentDidMount() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        `${process.env.CREATEFILEKEY}`,
        SendFile.abi,
        provider
      );
      console.log(contract);
      try {
        const data = await contract.getFiles();
        const dataArray: any[] = [];
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          console.log(element.userAddress);

          if (
            element.userAddress.toLowerCase() ===
            window.ethereum.selectedAddress
          ) {
            console.log("File Added");
            dataArray.push(element);
          }
        }

        this.setState({ UserFiles: dataArray });

        //this.setState({ totalStorage: dataArray });
        console.log(this.state.UserFiles);

        this.state.UserFiles.forEach((element) => {
          console.log(element.fileSize);
          const sizeNumber = Number(element.fileSize);
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

        const totalFileSize = calc(sizeArray);
        console.log(totalFileSize);
        this.setState({ totalFileSize: totalFileSize });
      } catch (err: unknown) {
        console.log("Error: ", err);
      }
    }
  }

  async createFiles(e: any) {
    e.preventDefault();
    console.log(
      this.state._FileName,
      this.state._FileLink,
      this.state._FileSize
    );

    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        `${process.env.CREATEFILEKEY}`,
        SendFile.abi,
        signer
      );
      console.log(contract);

      const data = await contract.getFiles();
      const dataArray: any[] = [];
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        console.log(element.userAddress);

        if (
          element.userAddress.toLowerCase() === window.ethereum.selectedAddress
        ) {
          console.log("File Added");
          dataArray.push(element);
        }
      }

      this.setState({ UserFiles: dataArray });

      //this.setState({ totalStorage: dataArray });
      console.log(this.state.UserFiles);

      this.state.UserFiles.forEach((element) => {
        console.log(element.fileSize);
        const sizeNumber = Number(element.fileSize);
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

      const totalFileSize = calc(sizeArray);
      console.log(totalFileSize);

      if (totalFileSize >= 2) {
        console.log("over storage");
      } else {
        console.log("normall pass");
      }
      try {
        const token: string | any = process.env.WEB3STORAGE || "";
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
            _FileLink: process.env.FILELINK || "",
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
      <>
        <div>
          {this.state.UserFiles.map((data: any) => (
            <div>
              <p> {data.userAddress} </p>
              <p> {data.fileName} </p>
            </div>
          ))}
        </div>
      </>
    );
  }
}
