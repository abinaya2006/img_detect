import * as React from 'react'
import { View,  Button,Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'

export default class PickImage extends React.Component {
    state = {
        image: null
    }

    render() {
        let { image } = this.state

        return (
            <View style={{justifyContent:"center",alignItems:"center",alignSelf:"center",
            marginTop:250}}>
                <Button
                    title="Pick an image from gallery"
                    onPress={this._pickImage}
                />
            </View>
        )
    }

    componentDidMount(){
        this.getPermissionsAsync()
    }

    getPermissionsAsync = async () => {
        if (Platform.OS !== "web") {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)

            if (status !== "granted") {
                alert("Sorry,we need camera permissions for this app to work.")
            }
        }
    }

    _pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1
            })

            if (!result.cancelled) {
                this.setState({
                    image: result.data
                })
                this.uploadImage(result.uri)

            }

        }

        catch (e) {
            console.log(e)
        }
    }

    uploadImage = async (uri) => {
        const data = new FormData()
        let filename = uri.split("/")[uri.split("/").length - 1]
        let file_type = `image/${uri.split(".")[uri.split(".").length - 1]}`

        const filetoUpload = {
            uri: uri,
            name: filename,
            type: file_type
        }

        data.append("alphabet", filetoUpload)

        fetch("http://fc9b-2402-3a80-19a8-7964-4cd4-f29-f1b4-f855.ngrok.io/predict-alphabet", {
            method: "POST",
            body: data,
            headers: {
                "content-type": "multipart/form-data"
            }
        })

            .then((response) => response.json())
            .then((result) => {
                console.log("Success", result)
            })
            .catch((error) => {
                console.log("error: ", error)
            })
    }

}

