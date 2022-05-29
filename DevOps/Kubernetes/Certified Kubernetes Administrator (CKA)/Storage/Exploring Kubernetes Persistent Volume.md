# Exploring Kubernetes Persistent Volume
## PersistentVolume
PV allow you to treat storage as an abstract resource to be consumed by pods 

## StorageClass
StorageClass allow k8s admin to specify the types of storage service they offer on their platform

The `allowVolumeExpansion` need be set to true, if you anticipate to expand the storage in the future

`persistentVolumeReclaimPolicy` determines how the storage resources can be reused when the PV's associated PVC is deleted
* Retain
* Delete
* Recycle

## PersistentVolumeClaim
PVC represent a user's request for storage resources.

When a PVC is created, it will look for a PV that is able to meet the criteria, then it will automatically bound to the PV

## Resize a PersistetVolumeClaim
You can expand the PVC, by simply editing the storage size attribute, without interrupting applications that are using them.

However, the StorageClass must support resizing and the `allowVolumeExpansion` need be set to true,