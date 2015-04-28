define('app/views/machine_list', ['app/views/page', 'app/controllers/base_array'],
    /**
     * Machine List View
     *
     * @returns Class
     */
    function (PageView, BaseArrayController) {
        return App.MachineListView = PageView.extend({

            /**
             *
             *  Properties
             *
             */

             machines: BaseArrayController.create({
                 sortCallback: function (array) {
                     return array.sortBy(Mist.machineSortListMode);
                 },
                 _updateObject: function () {}
             }),


            /**
             *
             *  Initialization
             *
             */

            load: function () {
                window.m = this;
                // Add event listeners
                Mist.backendsController.on('onMachineProbe', this, 'updateFooter');
                Mist.backendsController.on('onSelectedMachinesChange', this, 'updateFooter');
                Mist.backendsController.on('onMachineListChange', this,'machineInit');
                this.machineInit();
            }.on('didInsertElement'),


            unload: function () {

                // Remove event listeners
                Mist.backendsController.off('onMachineProbe', this, 'updateFooter');
                Mist.backendsController.off('onSelectedMachinesChange', this, 'updateFooter');
                Mist.backendsController.off('onMachineListChange', this,'machineInit');

            }.on('willDestroyElement'),


            /**
             *
             *  Methods
             *
             */

            updateFooter: function () {

                if (Mist.machineShellController.isOpen)
                    return;

                switch (Mist.backendsController.selectedMachines.length) {
                case 0:
                    $('#machine-list-page .ui-footer').slideUp();
                    break;
                case 1:
                    var machine = Mist.backendsController.selectedMachines[0];

                    $('#machine-list-page .ui-footer').slideDown();

                    if (machine.can_tag) {
                        $('#machine-list-page #machines-tags-btn').removeClass('ui-state-disabled');
                    } else {
                        $('#machine-list-page #machines-tags-btn').addClass('ui-state-disabled');
                    }

                    if (machine.get('hasKeys') && machine.state == 'running') {
                        $('#machine-list-page #machines-shell-btn').removeClass('ui-state-disabled');
                    } else {
                        $('#machine-list-page #machines-shell-btn').addClass('ui-state-disabled');
                    }
                    break;
                default:
                    $('#machine-list-page .ui-footer').slideDown();
                    $('#machine-list-page #machines-tags-btn').addClass('ui-state-disabled');
                    $('#machine-list-page #machines-shell-btn').addClass('ui-state-disabled');
                    break;
                }
            },

            machineInit: function (){
                var backends = Mist.backendsController.content;
                var machineList = [];
                backends.forEach(function (backend) {
                    machineList.pushObjects(backend.machines.content);
                });
                this.get('machines').setContent(machineList);
            },


            /**
             *
             *  Actions
             *
             */

            actions: {


                createClicked: function () {
                    Mist.machineAddController.open();
                },


                tagsClicked: function () {
                    Mist.machineTagsController.open(Mist.backendsController.selectedMachines[0]);
                },


                powerClicked: function () {
                    Mist.machinePowerController.open(Mist.backendsController.selectedMachines);
                },


                shellClicked: function () {
                    Mist.machineShellController.open(Mist.backendsController.selectedMachines[0]);
                },


                selectClicked: function () {
                    $('#select-machines-popup').popup('open').find('.ui-listview').listview('refresh');
                },


                selectionModeClicked: function (mode) {

                    $('#select-machines-popup').popup('close');

                    Mist.backendsController.content.forEach(function (backend) {
                        backend.machines.content.forEach(function (machine) {
                            machine.set('selected', mode == 'all' || mode == backend.title);
                        });
                    });
                },


                sortByModeClicked: function (mode) {

                    $('#select-machines-popup').popup('close');
                    Mist.set('machineSortListMode', mode);
                    this.get('machines').setContent(this.get('machines'));
                }
            }
        });
    }
);
