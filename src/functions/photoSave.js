
import { Media } from "@capacitor-community/media";
import { Capacitor } from "@capacitor/core";

async function getAlbum() {
    const { albums } = await Media.getAlbums();
    return albums[0] || null;
}

export async function savePhotoToGallery(path) {
    if (Capacitor.getPlatform() === 'ios') {
        await Media.savePhoto({ path });
    } else {
        const album = await getAlbum();
        Media.savePhoto({ path, albumIdentifier: album.identifier }).then((result) => {
            console.log(result);
        }).catch((error) => {
            console.error(error);
        });
    }
}
