import { toastController } from '@ionic/vue';
import { apiRequest } from '@/stores/functions';
import { Contacts, PhoneType } from '@capacitor-community/contacts';

var importingContacts = false;

const company = "Obóz'24";

export async function importContacts() {
    if (importingContacts) return;

    const permissionStatus = await Contacts.requestPermissions();
    if (permissionStatus.contacts !== 'granted') {
        const toast = await toastController.create({
            message: 'Brak uprawnień do kontaktów!',
            duration: 2000,
            color: 'danger',
            position: 'top'
        })
        toast.present()
        return;
    }

    importingContacts = true;
    const toast = await toastController.create({
        message: 'Importowanie kontaktów... czekaj...',
        position: 'top'
    })
    toast.present()

    try {
        const response = await apiRequest('../staff-api/get-contacts/', 'GET')

        var res = []
        for (let i = 0; i < response.length; i++) {
            res.push(Contacts.createContact({
                contact: {
                    name: {
                        given: response[i].first_name,
                        family: response[i].last_name,
                    },
                    organization: {
                        'company': company,
                        'jobTitle': response[i].title,
                    },
                    note: response[i].note,
                    phones: [
                        {
                            type: PhoneType.Mobile,
                            label: 'mobile',
                            number: response[i].phone,
                        },
                    ],
                },
            }));
        }

        Promise.all(res).then(() => {
            toast.dismiss();
            importingContacts = false;

            toastController.create({
                message: res.length + ' kontakty zaimportowane!',
                duration: 2000,
                color: 'success',
                position: 'top'
            }).then(toast => toast.present())
        });
    } catch (error) {
        console.error(error)
        toast.dismiss()
        importingContacts = false;

        toastController.create({
            message: 'Błąd podczas importowania kontaktów: ' + error,
            duration: 2000,
            color: 'danger',
            position: 'top'
        }).then(toast => toast)
    }
}


export async function deleteContacts() {
    const toast = await toastController.create({
        message: 'Usuwanie kontaktów... czekaj...',
        position: 'top'
    })
    toast.present()

    try {
        const projection = {
            // Specify which fields should be retrieved.
            name: true,
            organization: true,
        };

        const contacts = await Contacts.getContacts({ projection });

        var res = []
        for (let i = 0; i < contacts.contacts.length; i++) {
            if (contacts.contacts[i].organization.company === company) {
                res.push(Contacts.deleteContact({
                    contactId: contacts.contacts[i].contactId,
                }));
            }
        }

        Promise.all(res).then(() => {
            toast.dismiss();

            toastController.create({
                message: res.length + ' kontakty usunięte!',
                duration: 2000,
                color: 'success',
                position: 'top'
            }).then(toast => toast.present())
        });
    } catch (error) {
        console.error(error)
        toast.dismiss()
    }
}